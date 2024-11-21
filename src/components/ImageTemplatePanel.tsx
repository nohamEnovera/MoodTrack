import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { X } from 'lucide-react';
import { useIntl } from 'react-intl';
import { templateBackgrounds } from '../utils/templates';

interface ImageTemplatePanelProps {
  isOpen: boolean;
  onClose: () => void;
  mood: string;
  description: string;
  onTemplateSelect: (template: number) => void;
}

export function ImageTemplatePanel({
  isOpen,
  onClose,
  mood,
  description,
  onTemplateSelect
}: ImageTemplatePanelProps) {
  const intl = useIntl();

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-full"
              enterTo="opacity-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-full"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-t-3xl bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all w-full sm:p-6">
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title className="text-xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                    {intl.formatMessage({ id: 'share.image.modal.title' })}
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 overflow-y-auto pb-safe max-h-[60vh]">
                  {templateBackgrounds.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => onTemplateSelect(template.id)}
                      className="relative aspect-[9/16] rounded-xl overflow-hidden group hover:ring-2 hover:ring-violet-500 hover:ring-offset-2 transition-all duration-300"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${template.gradient}`}>
                        <div className={`absolute inset-0 opacity-20 pattern-${template.pattern}`} />
                      </div>
                      <div className="absolute inset-0 flex flex-col items-center p-4 text-white">
                        <div className="text-lg font-bold mt-8">{mood}</div>
                        <div className="flex-1 flex items-center justify-center px-2">
                          <div className="text-sm line-clamp-3 text-center">{description}</div>
                        </div>
                        <div className="text-xs opacity-50 mb-2">MoodTrack</div>
                      </div>
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white font-medium">
                          {intl.formatMessage({ id: 'share.template.select' })}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}