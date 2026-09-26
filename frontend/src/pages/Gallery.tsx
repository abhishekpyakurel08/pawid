import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { galleryService } from '../services/gallery.service';
import { GalleryPhoto } from '../types/gallery';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { LoadingState } from '../components/common/LoadingState';
import { EmptyState } from '../components/common/EmptyState';
import { Camera, MapPin, QrCode, Plus, CheckCircle2, Eye, Tag, ArrowRight } from 'lucide-react';
import { formatDate } from '../lib/utils';
import { Link } from 'react-router-dom';
import { ImageUpload } from '../components/common/ImageUpload';

export function Gallery() {
  const queryClient = useQueryClient();
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [areaFilter, setAreaFilter] = useState<string>('');
  const [activePhoto, setActivePhoto] = useState<GalleryPhoto | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [area, setArea] = useState('Kathmandu');
  const [pawId, setPawId] = useState('');
  const [submittedBy, setSubmittedBy] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const { data: photos = [], isLoading } = useQuery({
    queryKey: ['gallery', selectedTag, areaFilter],
    queryFn: () => galleryService.getGallery({ tag: selectedTag || undefined, area: areaFilter || undefined }),
  });

  const submitMutation = useMutation({
    mutationFn: (payload: any) => galleryService.submitPhoto(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
      setSubmittedSuccess(true);
    },
  });

  const handleSubmitPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !imageUrl) return;
    submitMutation.mutate({
      title,
      caption,
      imageUrl,
      area,
      pawId: pawId ? pawId.toUpperCase() : undefined,
      submittedBy: submittedBy || 'Community Member',
      tags: ['Community Photo', area],
    });
  };

  const allTags = ['Kathmandu', 'Lalitpur', 'Vaccinated', 'Sterilized', 'Outreach', 'Ratna Park', 'Patan'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Bar */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-forest-100 text-forest-900 text-xs font-bold rounded-full mb-2">
          <Camera className="w-3.5 h-3.5 text-amber-golden" />
          Community Animal Photo Archive
        </div>
        <h1 className="text-3xl font-extrabold text-forest-900 tracking-tight">
          PawID Community Gallery
        </h1>
        <p className="text-sm text-charcoal-light mt-1">
          Moments of street animals cared for by neighborhoods and volunteers across Nepal.
        </p>
      </div>

      {/* Filter Tag Bar */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-4 rounded-2xl border border-forest-100 shadow-sm">
        <span className="text-xs font-bold text-slate-500 mr-2 flex items-center gap-1">
          <Tag className="w-3.5 h-3.5" /> Filter Tags:
        </span>
        <button
          onClick={() => setSelectedTag('')}
          className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
            !selectedTag ? 'bg-forest-900 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          All Photos
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              selectedTag === tag
                ? 'bg-amber-golden text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Photo Gallery Grid */}
      {isLoading ? (
        <LoadingState message="Loading community photo gallery..." />
      ) : photos.length === 0 ? (
        <EmptyState
          icon={<Camera className="w-8 h-8 text-amber-golden" />}
          title="No Photos Found"
          description="No community gallery photos match your selected filter tag."
          action={
            <Button variant="outline" size="sm" onClick={() => setSelectedTag('')}>
              Clear Filter Tags
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo) => (
            <Card
              key={photo.id}
              className="overflow-hidden flex flex-col bg-white border border-forest-100 hover:border-forest-300 transition-all hover:-translate-y-1 hover:shadow-lg cursor-pointer group"
              onClick={() => setActivePhoto(photo)}
            >
              <div className="relative h-60 bg-slate-100 overflow-hidden">
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="text-xs text-white font-bold flex items-center gap-1">
                    <Eye className="w-4 h-4 text-amber-golden" /> Click to enlarge
                  </span>
                </div>

                {photo.pawId && (
                  <span className="absolute top-3 left-3 bg-forest-900/90 backdrop-blur text-amber-golden font-mono font-bold text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow">
                    <QrCode className="w-3 h-3" />
                    {photo.pawId}
                  </span>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-base font-extrabold text-forest-900 leading-snug">
                    {photo.title}
                  </h3>
                  {photo.caption && (
                    <p className="text-xs text-charcoal-light mt-1.5 line-clamp-2">
                      {photo.caption}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1 font-semibold text-forest-800">
                    <MapPin className="w-3.5 h-3.5 text-amber-golden" />
                    {photo.area}
                  </span>
                  <span>{formatDate(photo.createdAt)}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {activePhoto && (
        <Modal isOpen={!!activePhoto} onClose={() => setActivePhoto(null)} title={activePhoto.title}>
          <div className="space-y-4">
            <div className="rounded-2xl overflow-hidden max-h-[70vh] bg-slate-100">
              <img src={activePhoto.imageUrl} alt={activePhoto.title} className="w-full h-full object-contain mx-auto" />
            </div>
            {activePhoto.caption && (
              <p className="text-sm text-charcoal bg-slate-50 p-4 rounded-xl border border-slate-100">
                {activePhoto.caption}
              </p>
            )}
            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
              <span>Photo by <strong>{activePhoto.submittedBy || 'Community Member'}</strong></span>
              {activePhoto.pawId && (
                <Link to={`/d/${activePhoto.pawId}`} className="text-forest-900 font-bold hover:text-amber-golden flex items-center gap-1">
                  <span>View Dog Profile ({activePhoto.pawId})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Upload Photo Modal */}
      <Modal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} title="Share a Community Photo">
        {submittedSuccess ? (
          <div className="p-6 text-center bg-emerald-50 rounded-2xl border border-emerald-200 space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h3 className="text-lg font-bold text-emerald-900">Photo Shared Successfully!</h3>
            <p className="text-xs text-emerald-800">
              Thank you for contributing to the PawID community photo archive.
            </p>
            <Button variant="outline" size="sm" onClick={() => setIsUploadOpen(false)}>
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmitPhoto} className="space-y-4">
            <Input
              label="Photo Title *"
              placeholder="e.g. Rocky enjoying the sun"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <ImageUpload
              label="Community Photo (Upload or Select) *"
              value={imageUrl}
              onChange={setImageUrl}
              required
              maxSizeMb={4}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="City / Area *"
                placeholder="e.g. Kathmandu"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                required
              />
              <Input
                label="PawID (Optional)"
                placeholder="e.g. PAW-NP-A8F42K"
                value={pawId}
                onChange={(e) => setPawId(e.target.value)}
              />
            </div>
            <Input
              label="Your Name (Optional)"
              placeholder="e.g. Anish S."
              value={submittedBy}
              onChange={(e) => setSubmittedBy(e.target.value)}
            />
            <div>
              <label className="block text-xs font-bold text-forest-900 uppercase tracking-wider mb-1">
                Caption / Story (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Tell us a little bit about this moment..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-forest-900"
              />
            </div>
            <Button type="submit" variant="primary" size="lg" isLoading={submitMutation.isPending} className="w-full font-bold">
              Submit Photo
            </Button>
          </form>
        )}
      </Modal>
    </div>
  );
}
