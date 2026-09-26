import { useState } from 'react';
import { Mail, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-forest-100 text-forest-900 text-xs font-bold rounded-full">
          <MessageSquare className="w-4 h-4 text-amber-golden" />
          Get in Touch
        </div>
        <h1 className="text-3xl font-extrabold text-forest-900 tracking-tight">
          Contact PawID
        </h1>
        <p className="text-sm text-charcoal-light max-w-lg mx-auto">
          Have questions about QR tag distribution, animal registration, or partnership opportunities? Send us a message.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Contact info card */}
        <Card className="md:col-span-5 p-6 bg-forest-900 text-white space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">PawID Project Office</h3>
            <p className="text-xs text-forest-200 leading-relaxed">
              We work closely with local community caretakers, animal welfare organizations, and municipalities across Nepal.
            </p>

            <div className="space-y-3 pt-4 border-t border-forest-800 text-xs text-forest-200">
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-golden shrink-0" />
                <span>info@pawid.org</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-forest-950/60 rounded-xl border border-forest-800/80 text-[11px] text-forest-300">
            For urgent animal emergency or rescue cases, please contact your local shelter or veterinarian directly.
          </div>
        </Card>

        {/* Contact Form */}
        <Card className="md:col-span-7 p-6 bg-white border border-forest-100">
          {submitted ? (
            <div className="p-8 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-lg font-bold text-forest-900">Message Received!</h3>
              <p className="text-xs text-slate-600">
                Thank you for contacting PawID. We will review your message and reply via email shortly.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSubmitted(false);
                  setMessage('');
                }}
              >
                Send Another Message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Your Name"
                placeholder="e.g. Maya Shrestha"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                label="Email Address"
                type="email"
                placeholder="maya@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                label="Subject"
                placeholder="How can we help?"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
              <div>
                <label className="block text-xs font-bold text-forest-900 uppercase tracking-wider mb-1.5">
                  Message
                </label>
                <textarea
                  rows={4}
                  placeholder="Type your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-forest-900"
                  required
                />
              </div>
              <Button type="submit" variant="primary" size="lg" className="w-full gap-2 font-bold">
                <Send className="w-4 h-4" />
                Send Message
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
