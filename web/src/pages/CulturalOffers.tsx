import { useState, useEffect, SetStateAction} from 'react';
import {useOffersStore} from '../hooks/useOffres';
import {useAuthStore} from '../store/authStore';
import {Calendar} from '../components/Calendar/Calendar';
import {OffersTable} from '../components/Tables/OffersTable';
import {ViewModeToggle} from '../components/ViewModeToggle/ViewModeToggle';
import {StatsCard} from '../components/Cards/StatsCard';
import {Modal} from '../components/ui/Modal';
import {ConfirmDialog} from '../components/ui/ConfirmDialog';
import {Button} from '../components/ui/Button';
import {CalendarIcon, MapPin, Plus, Tag} from 'lucide-react';
import OfferForm from '../components/ui/OfferForm';
import {CategoryFilter} from '../components/filter/CategoryFilter';
import {OfferDetailModal} from '../components/ui/OfferDetailModal';
import {Offer} from '../types/types';

export const CulturalOffers = () => {
    const [viewMode, setViewMode] = useState('list');
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Modal states
    const [selectedOffer, setSelectedOffer] = useState(null);
    const [showDetail, setShowDetail] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [formData, setFormData] = useState(undefined);

    const {user, checkAuth} = useAuthStore();
    const {offers = [], fetchOffers, createOffer, updateOffer, deleteOffer, fetchOffersByPartner} = useOffersStore();

    // Load data

    useEffect(() => {
        if (!user) return;
        if (user.role === 'Admin') {
            console.log(user.role)
            fetchOffers();
        } else if (user._id) {
            fetchOffersByPartner(user._id);
        }
    }, [user]);

    // Filter valid offers
    const validOffers = offers.filter(offer => offer?._id);

    // Get unique categories
    const categories = [...new Set(validOffers.map(o => o.categories).filter(Boolean))];

    // Filter by category
    const filteredOffers = selectedCategory === 'All'
        ? validOffers
        : validOffers.filter(o => o.categories === selectedCategory);

    // Calculate stats
    const isActive = (startDate) => {
        if (!startDate) return false;
        const start = new Date(startDate);
        const end = new Date(start.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
        const now = new Date();
        return now >= start && now <= end;
    };

    const stats = {
        total: filteredOffers.length,
        active: filteredOffers.filter(o => isActive(o.dateStart)).length,
        partners: new Set(filteredOffers.map(o => o.createdBy?._id || o.createdBy)).size
    };

    // Category counts
    const categoryCounts = {
        All: validOffers.length,
        ...validOffers.reduce((acc, o) => {
            if (o.categories) acc[o.categories] = (acc[o.categories] || 0) + 1;
            return acc;
        }, {})
    };

    // Calendar events
    const calendarEvents = filteredOffers
        .filter(o => o.title && o.dateStart && o.categories)
        .map(o => ({
            _id: o._id,
            title: o.title,
            date: o.dateStart,
            categories: o.categories
        }));

    // Event handlers
    const openDetail = (offer: Offer | SetStateAction<null>) => {
        setSelectedOffer(offer);
        setShowDetail(true);
    };

    const openForm = (offer = null) => {
        setFormData(offer ? {
            _id: offer._id,
            title: offer.title,
            description: offer.description,
            price: offer.price,
            location: offer.location,
            dateStart: offer.dateStart ? new Date(offer.dateStart) : undefined,
            categories: offer.categories,
            imageUrl: offer.imageUrl,
            createdBy: offer.createdBy?._id || offer.createdBy
        } : undefined);
        setShowForm(true);
    };

    const openDelete = (offer) => {
        setSelectedOffer(offer);
        setShowDelete(true);
    };

    const handleSubmit = async (values) => {
        if (formData?._id) {
            await updateOffer(formData._id, values);
        } else {
            await createOffer(values);
        }
        setShowForm(false);
        setFormData(undefined);
    };

    const handleDelete = async () => {
        if (selectedOffer?._id) {
            await deleteOffer(selectedOffer._id);
            setShowDelete(false);
            setShowDetail(false);
            setSelectedOffer(null);
        }
    };

    const closeModals = () => {
        setShowDetail(false);
        setShowForm(false);
        setShowDelete(false);
        setSelectedOffer(null);
        setFormData(undefined);
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">
                    {user?.role === 'Admin' ? 'All Cultural Offers' : 'My Cultural Offers'}
                </h1>
                <div className="flex gap-4">
                    <ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
                    {user?.role !== 'Admin' && (
                        <Button onClick={() => openForm()}>
                            <Plus className="h-4 w-4 mr-2" /> Add Offer
                        </Button>
                    )}
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <StatsCard icon={<Tag className="h-6 w-6" />} title="Total Offers" value={stats.total} />
                <StatsCard icon={<CalendarIcon className="h-6 w-6" />} title="Active Offers" value={stats.active} color="green" />
                {user?.role === 'Admin' && (
                    <StatsCard icon={<MapPin className="h-6 w-6" />} title="Unique Partners" value={stats.partners} color="purple" />
                )}
            </div>

            {/* Filter */}
            <CategoryFilter
                categories={categories}
                counts={categoryCounts}
                selected={selectedCategory}
                onChange={setSelectedCategory}
                allLabel="All"
            />

            {/* Main Content */}
            {viewMode === 'calendar' ? (
                <Calendar
                    events={calendarEvents}
                    onEventClick={(e) => {
                        const offer = filteredOffers.find(o => o._id === e._id);
                        if (offer) openDetail(offer);
                    }}
                    onDateClick={(date) => openForm({ dateStart: date })}
                />
            ) : (
                <OffersTable
                    offers={filteredOffers}
                    onView={openDetail}
                    onEdit={openForm}
                    onDelete={openDelete}
                    isAdmin={user?.role === 'Admin'}
                />
            )}

            {/* Modals */}
            {selectedOffer && (
                <OfferDetailModal
                    isOpen={showDetail}
                    onClose={closeModals}
                    offer={selectedOffer}
                    onEdit={() => {
                        setShowDetail(false);
                        openForm(selectedOffer);
                    }}
                    onDelete={() => setShowDelete(true)}
                />
            )}

            <Modal isOpen={showForm} onClose={closeModals}>
                <OfferForm
                    initialValues={formData}
                    onSubmit={handleSubmit}
                    isAdmin={user?.role === 'Admin'} onClose={function (): void {
                    throw new Error('Function not implemented.');
                }}                />
            </Modal>

            <ConfirmDialog
                isOpen={showDelete}
                onClose={closeModals}
                onConfirm={handleDelete}
                title="Delete Offer"
                message="Are you sure you want to delete this offer?"
            />
        </div>
    );
};