import { Check } from 'lucide-react';
import { cn } from '@shared/utils/cn';
import { tollNotificationService } from '../../services/toll-notification.service';
import type { TollNotificationStatus } from '../../types/toll-notification.types';

const STEPS = [
  { step: 1, label: 'Draft',       sub: 'PIU creates' },
  { step: 2, label: 'Submitted',   sub: 'PIU submits' },
  { step: 3, label: 'CO Reviewed', sub: 'E-Office updated' },
  { step: 4, label: 'S.O. Issued', sub: 'S.O. number added' },
  { step: 5, label: 'Published',   sub: 'Notification live' },
];

interface WorkflowStepperProps {
  status: TollNotificationStatus;
}

export const WorkflowStepper = ({ status }: WorkflowStepperProps) => {
  const current = tollNotificationService.getWorkflowStep(status);
  const isRejected = status === 'REJECTED';

  return (
    <div className="flex items-start gap-0 overflow-x-auto pb-1">
      {STEPS.map((s, i) => {
      const done   = current > s.step || (status === 'PUBLISHED' && s.step === 5);
      const active = current === s.step && !isRejected && status !== 'PUBLISHED';

        return (
          <div key={s.step} className="flex items-start flex-1 min-w-[90px]">
            {/* Step circle + connector */}
            <div className="flex flex-col items-center flex-1">
              <div className="flex items-center w-full">
                {/* Left line */}
                {i > 0 && (
                  <div className={cn('flex-1 h-0.5', done || active ? 'bg-blue-500' : 'bg-gray-200')} />
                )}                {/* Circle */}
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold border-2',
                  isRejected && s.step <= 2
                    ? 'border-red-500 bg-red-50 text-red-600'
                    : done
                    ? 'border-blue-500 bg-blue-500 text-white'
                    : active
                    ? 'border-blue-500 bg-white text-blue-600'
                    : 'border-gray-300 bg-white text-gray-400',
                )}>
                  {done ? <Check className="w-4 h-4" /> : s.step}
                </div>
                {/* Right line */}
                {i < STEPS.length - 1 && (
                  <div className={cn('flex-1 h-0.5', done ? 'bg-blue-500' : 'bg-gray-200')} />
                )}
              </div>
              {/* Label */}
              <p className={cn(
                'text-[10px] font-semibold mt-1.5 text-center leading-tight',
                active ? 'text-blue-600' : done ? 'text-blue-500' : 'text-gray-400',
                isRejected && s.step <= 2 && 'text-red-500',
              )}>
                {s.label}
              </p>
              <p className={cn(
                'text-[9px] text-center leading-tight',
                done ? 'text-blue-400' : 'text-gray-400',
              )}>{s.sub}</p>
            </div>
          </div>
        );
      })}

      {/* Rejected indicator */}
      {isRejected && (
        <div className="flex flex-col items-center ml-2 flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
            <span className="text-white text-xs font-bold">✕</span>
          </div>
          <p className="text-[10px] font-semibold mt-1.5 text-red-500 text-center">Rejected</p>
        </div>
      )}
    </div>
  );
};
