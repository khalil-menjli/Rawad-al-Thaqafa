import React, { useState, DragEvent, useRef, ChangeEvent, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar, MapPin, DollarSign, FileText, Upload, X } from 'lucide-react';
import { offerSchema } from '../../validations/offerSchema';
import { Button } from './Button';
import { OfferFormData } from "../../types/types.ts";

interface OfferFormProps {
  initialValues?: Partial<OfferFormData>;
  onSubmit: (data: OfferFormData) => Promise<void>;
  onClose: () => void;
  isAdmin?: boolean;
}

const OfferFormModal: React.FC<OfferFormProps> = ({ initialValues, onSubmit, onClose, isAdmin }) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<OfferFormData>({
    resolver: zodResolver(offerSchema),
    defaultValues: {
      title: '',
      dateStart: new Date(),
      location: '',
      price: 0,
      categories: undefined,
      description: '',
      imageFile: undefined,
    },
    mode: 'onChange',
  });

  const isEditMode = !!initialValues?._id;

  // Reset form when initialValues change and handle image preview
  useEffect(() => {
    if (initialValues) {
      // Convert dateStart to proper string format for the schema
      const dateStartValue = initialValues.dateStart
          ? (initialValues.dateStart instanceof Date
              ? initialValues.dateStart.toISOString().split('T')[0]
              : new Date(initialValues.dateStart).toISOString().split('T')[0])
          : new Date().toISOString().split('T')[0];

      reset({
        title: initialValues.title || '',
        dateStart: dateStartValue, // Keep as string for schema validation
        location: initialValues.location || '',
        price: initialValues.price || 0,
        categories: initialValues.categories,
        description: initialValues.description || '',
        imageFile: initialValues.imageFile,
        _id: initialValues._id,
      });

      // Handle image preview for edit mode - fix the URL path
      if (initialValues.imageUrl) {
        // Construct the full URL for the image
        const fullImageUrl = initialValues.imageUrl.startsWith('http')
            ? initialValues.imageUrl
            : `http://localhost:3000${initialValues.imageUrl}`;
        setPreviewImage(fullImageUrl);
      } else if (initialValues.imageFile) {
        if (typeof initialValues.imageFile === 'string') {
          // If imageFile is a string URL, construct full URL
          const fullImageUrl = initialValues.imageFile.startsWith('http')
              ? initialValues.imageFile
              : `http://localhost:3000${initialValues.imageFile}`;
          setPreviewImage(fullImageUrl);
        } else if (initialValues.imageFile instanceof File) {
          setPreviewImage(URL.createObjectURL(initialValues.imageFile));
        }
      } else {
        setPreviewImage(null);
      }
    } else {
      // Reset to default values when no initial values
      reset({
        title: '',
        dateStart: new Date().toISOString().split('T')[0], // Keep as string
        location: '',
        price: 0,
        categories: undefined,
        description: '',
        imageFile: undefined,
      });
      setPreviewImage(null);
    }
  }, [initialValues, reset]);

  const openFileDialog = () => fileInputRef.current?.click();

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFiles(file);
  };

  const handleDrag = (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleFiles = (file: File) => {
    const objectUrl = URL.createObjectURL(file);
    setPreviewImage(objectUrl);
    setValue('imageFile', file, { shouldValidate: true, shouldDirty: true });
  };

  const handleDrop = (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFiles(file);
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewImage(null);
    setValue('imageFile', undefined, { shouldValidate: true });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    onClose();
  };

  const onSubmitForm = handleSubmit(async (data) => {
    // Ensure we pass along the _id if we're editing
    if (initialValues?._id) {
      data._id = initialValues._id;
    }
    await onSubmit(data);
  });

  // Get the current dateStart value for the input
  const currentDateStart = watch('dateStart');
  const dateInputValue = typeof currentDateStart === 'string'
      ? currentDateStart
      : (currentDateStart instanceof Date
          ? currentDateStart.toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0]);

  return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              {isEditMode ? 'Edit Offer' : 'Create New Offer'}
            </h2>
            <button
                type="button"
                onClick={handleClose}
                className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={onSubmitForm} className="p-6 space-y-4">
            {/* Include hidden _id field if we're editing */}
            {isEditMode && (
                <input type="hidden" {...register('_id')} value={initialValues?._id} />
            )}

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Offer Title *
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                    type="text"
                    {...register('title')}
                    placeholder="e.g., 50% Off Cinema Tickets"
                    className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.title ? 'border-red-300' : 'border-gray-300'
                    }`}
                />
              </div>
              {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                      type="date"
                      value={dateInputValue}
                      onChange={(e) => {
                        // Keep as string to match schema validation
                        setValue('dateStart', e.target.value, { shouldValidate: true });
                      }}
                      className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.dateStart ? 'border-red-300' : 'border-gray-300'
                      }`}
                  />
                </div>
                {errors.dateStart && (
                    <p className="mt-1 text-sm text-red-600">{errors.dateStart.message}</p>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                      type="text"
                      {...register('location')}
                      placeholder="e.g., Downtown Cinema"
                      className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.location ? 'border-red-300' : 'border-gray-300'
                      }`}
                  />
                </div>
                {errors.location && (
                    <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
                )}
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                      type="number"
                      min="0"
                      step="0.01"
                      {...register('price', { valueAsNumber: true })}
                      placeholder="0.00"
                      className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.price ? 'border-red-300' : 'border-gray-300'
                      }`}
                  />
                </div>
                {errors.price && (
                    <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                    {...register('categories')}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.categories ? 'border-red-300' : 'border-gray-300'
                    }`}
                >
                  <option value="">Select category</option>
                  {['Books', 'Museums', 'Library', 'Cinema'].map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.categories && (
                    <p className="mt-1 text-sm text-red-600">{errors.categories.message}</p>
                )}
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Offer Image *
              </label>
              <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={openFileDialog}
                  className={`relative border-2 border-dashed rounded-md p-4 text-center cursor-pointer transition-all ${
                      dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
              >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileInputChange}
                />

                {previewImage ? (
                    <div className="relative">
                      <img src={previewImage} alt="Preview" className="mx-auto h-32 w-32 object-cover rounded-lg" />
                      <button
                          type="button"
                          onClick={removeImage}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      <p className="mt-2 text-sm text-gray-500">
                        {watch('imageFile') instanceof File ? (watch('imageFile') as File).name : "Current image"}
                      </p>
                    </div>
                ) : (
                    <div className="py-6">
                      <Upload className="mx-auto h-8 w-8 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">
                        <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                )}
              </div>
              {errors.imageFile && (
                  <p className="mt-1 text-sm text-red-600">{errors.imageFile.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                  rows={4}
                  {...register('description')}
                  placeholder="Describe your offer in detail..."
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                      errors.description ? 'border-red-300' : 'border-gray-300'
                  }`}
              />
              {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                  type="button"
                  variant="secondary"
                  onClick={handleClose}
                  className="flex-1"
              >
                Cancel
              </Button>
              <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1"
              >
                {isSubmitting ? 'Saving...' : isEditMode ? 'Update Offer' : 'Create Offer'}
              </Button>
            </div>
          </form>
        </div>
      </div>
  );
};

export default OfferFormModal;