import { Dog } from '../models/Dog';
import { Sighting } from '../models/Sighting';
import { Report } from '../models/Report';
import { User } from '../models/User';
import { AuditLog } from '../models/AuditLog';
import {
  DOG_STATUS,
  REPORT_STATUS,
  ROLES,
  STERILIZATION_STATUS,
  VACCINATION_STATUS,
} from '../config/constants';

export class AdminService {
  public static async getDashboardMetrics() {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const [
      totalDogs,
      activeDogs,
      missingDogs,
      vaccinatedDogs,
      sterilizedDogs,
      totalSightings,
      sightingsThisWeek,
      pendingReports,
      resolvedReports,
      totalVolunteers,
      recentActivity,
    ] = await Promise.all([
      Dog.countDocuments({ status: { $ne: DOG_STATUS.INACTIVE } }),
      Dog.countDocuments({ status: DOG_STATUS.ACTIVE }),
      Dog.countDocuments({ status: DOG_STATUS.MISSING }),
      Dog.countDocuments({ vaccinationStatus: VACCINATION_STATUS.VACCINATED }),
      Dog.countDocuments({ sterilizationStatus: STERILIZATION_STATUS.STERILIZED }),
      Sighting.countDocuments(),
      Sighting.countDocuments({ createdAt: { $gte: oneWeekAgo } }),
      Report.countDocuments({ status: REPORT_STATUS.PENDING }),
      Report.countDocuments({ status: REPORT_STATUS.RESOLVED }),
      User.countDocuments({ role: ROLES.VOLUNTEER, isActive: true }),
      AuditLog.find().sort({ createdAt: -1 }).limit(10).populate('userId', 'name role email'),
    ]);

    return {
      metrics: {
        totalDogs,
        activeDogs,
        missingDogs,
        vaccinatedDogs,
        sterilizedDogs,
        totalSightings,
        sightingsThisWeek,
        pendingReports,
        resolvedReports,
        totalVolunteers,
      },
      recentActivity,
    };
  }

  public static async createAuditLog(
    userId: string,
    action: string,
    resource: string,
    resourceId?: string,
    details?: Record<string, any>,
    ipAddress?: string
  ) {
    await AuditLog.create({
      userId,
      action,
      resource,
      resourceId,
      details,
      ipAddress,
    });
  }

  public static async getUsers(query: any) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {};
    if (query.role) filter.role = query.role;

    const [users, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(filter),
    ]);

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  public static async updateUserRole(userId: string, role: string) {
    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true }
    );
    return user;
  }
}
