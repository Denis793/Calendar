import React, { useState } from 'react';
import { Modal } from '@/shared/ui/Modal';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Icon } from '@/shared/ui/Icons/Icons';
import { useToast } from '@/shared/ui/Toast/ToastContext';
import { CALENDAR_CONSTANTS } from '@/shared/config/constants';
import { showEventToast } from '@/utils/eventHandlers';
import { createSecureShareLink } from '@/utils/secureShareUtils';
import { format } from 'date-fns';
import styles from './ShareEvent.module.scss';

const { TOAST_DURATION, FORMAT_DATE } = CALENDAR_CONSTANTS;

export const ShareEvent = ({ isOpen, onClose, event }) => {
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  if (!isOpen || !event) {
    return null;
  }

  const shareLink = createSecureShareLink(event);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      showEventToast('shared', showToast, { TOAST_DURATION });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
      showEventToast('shareError', showToast, { TOAST_DURATION });
    }
  };

  const handleShareViaEmail = () => {
    const subject = `Event: ${event.title}`;
    const body = `I'd like to share this event with you:

    Event: ${event.title}
    Date: ${format(new Date(event.date), FORMAT_DATE)}
    Time: ${event.startTime} - ${event.endTime}
    ${event.description ? `Description: ${event.description}` : ''}

View event: ${shareLink}`;

    const emailUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(emailUrl);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share Event" size="medium">
      <div className={styles.shareContainer}>
        <div className={styles.eventPreview}>
          <h3 className={styles.eventTitle}>{event.title}</h3>
          <p className={styles.eventDetails}>
            {format(new Date(event.date), FORMAT_DATE)} • {event.startTime} - {event.endTime}
          </p>
          {event.description && <p className={styles.eventDescription}>{event.description}</p>}
        </div>

        <div className={styles.linkSection}>
          <label className={styles.label}>Share Link</label>
          <div className={styles.linkContainer}>
            <Input value={shareLink} readOnly className={styles.linkInput} onClick={(e) => e.target.select()} />
            <Button
              type="button"
              variant={copied ? 'success' : 'secondary'}
              onClick={handleCopyLink}
              className={styles.copyButton}
            >
              {copied ? 'Copied!' : 'Copy'}
            </Button>

            <Button className={styles.shareButton} type="button" variant="secondary" onClick={handleShareViaEmail}>
              <Icon className="icon" name="send" />
            </Button>
          </div>
        </div>

        <div className={styles.actions}>
          <Button type="button" variant="primary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
