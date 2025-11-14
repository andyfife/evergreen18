'use client';

import { useEffect, useState } from 'react';
import { useActionState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  submitContactForm,
  type ContactActionState,
} from '@/app/actions/contactAction';

const initialState: ContactActionState = {
  success: false,
  message: undefined,
  errors: { name: '', email: '', comment: '', userId: '' },
};

export function ContactFormDialog() {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState<ContactActionState, FormData>(
    submitContactForm,
    initialState
  );

  // Controlled inputs are optional; keep if you want instant UI validation/clearing
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    comment: '',
  });
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  useEffect(() => {
    if (!state) return;
    if (state.success) {
      toast.success(state.message ?? 'Submitted!');
      setFormData({ name: '', email: '', comment: '' });
      setOpen(false);
    } else if (state.message) {
      toast.error(state.message, { description: 'Error' });
    }
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
          Contact Us
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Contact Us</DialogTitle>
        </DialogHeader>

        {/* Per docs: pass the Server Action (or formAction from useActionState) */}
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              className={state.errors?.name ? 'border-red-500' : ''}
            />
            {state.errors?.name && (
              <p className="text-sm text-red-500">{state.errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
              className={state.errors?.email ? 'border-red-500' : ''}
            />
            {state.errors?.email && (
              <p className="text-sm text-red-500">{state.errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Comment</Label>
            <Textarea
              id="comment"
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              placeholder="Your message or feedback"
              className={state.errors?.comment ? 'border-red-500' : ''}
            />
            {state.errors?.comment && (
              <p className="text-sm text-red-500">{state.errors.comment}</p>
            )}
          </div>

          {/* If you need userId, either bind or use hidden input:
          <input type="hidden" name="userId" value={userId ?? ''} />
          */}

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Submit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
