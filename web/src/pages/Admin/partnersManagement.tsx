import { useEffect, useState, useRef } from "react";
import {
  Loader,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  CircleCheckBig,
  BarChart3,
  Users,
  Book,
  Building2,
  Library,
  Film,
  ChevronLeft,
  ChevronRight,
  Globe,
  MapPin,
  Calendar,
  Mail,
  User,
} from "lucide-react";
import { useUserStore } from "../../hooks/useUsers";
import { useOffersStore } from "../../hooks/useOffres";
import type { Partner } from "../../types/types";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { Button } from "../../components/ui/Button";
import { PartnerModal } from "../../components/ui/PartnerModal";
import { CategoryFilter } from "../../components/filter/CategoryFilter";

// Derive category type from Partner interface
type Category = Partner["categories"][number];
type CategoryFilterType = Category | "All";

export const PartnersPage = () => {
  const [activeTab, setActiveTab] = useState<"approved" | "unapproved">("approved");
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilterType>("All");
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    partnerId: "",
    action: "delete" as "delete" | "approve",
  });

  // For offer slider
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideRef = useRef<HTMLDivElement>(null);

  const {
    partnersApproved,
    partnersNotApproved,
    loading: partnersLoading,
    error: partnersError,
    fetchPartnersApproved,
    fetchPartnersNotApproved,
    deletePartner,
    approvePartner,
  } = useUserStore();

  const {
    offers,
    loading: offersLoading,
    error: offersError,
    fetchOffersByOwner,
  } = useOffersStore();

  useEffect(() => {
    fetchPartnersApproved();
    fetchPartnersNotApproved();
  }, []);

  // Select correct list based on active tab
  const allPartners = activeTab === "approved" ? partnersApproved : partnersNotApproved;

  // Compute categories and counts
  const categoryCount: Record<Category, number> = {
    Books: allPartners.filter((p) => p.categories?.includes("Books")).length,
    Museums: allPartners.filter((p) => p.categories?.includes("Museums")).length,
    Library: allPartners.filter((p) => p.categories?.includes("Library")).length,
    Cinema: allPartners.filter((p) => p.categories?.includes("Cinema")).length,
  };
  const partnerCategories: Category[] = Object.keys(categoryCount) as Category[];

  // Filter partners by selected category
  const filteredPartners =
    selectedCategory === "All"
      ? allPartners
      : allPartners.filter((p) => p.categories?.includes(selectedCategory as Category));

  // Handlers
  const handleViewPartner = (partner: Partner) => {
    setSelectedPartner(partner);
    setIsModalOpen(true);
    setCurrentSlide(0);
    fetchOffersByOwner(partner._id);
  };
  const handleDeletePartner = (id: string) =>
    setConfirmDialog({
      isOpen: true,
      title: "Delete Partner",
      message: "Are you sure you want to delete this partner? This action cannot be undone.",
      partnerId: id,
      action: "delete",
    });
  const handleApprovePartner = (id: string) =>
    setConfirmDialog({
      isOpen: true,
      title: "Approve Partner",
      message: "Are you sure you want to approve this partner?",
      partnerId: id,
      action: "approve",
    });
  const confirmAction = () => {
    if (confirmDialog.action === "delete") deletePartner(confirmDialog.partnerId);
    else approvePartner(confirmDialog.partnerId);
    setConfirmDialog((cd) => ({ ...cd, isOpen: false }));
  };
  const closeConfirmDialog = () => setConfirmDialog((cd) => ({ ...cd, isOpen: false }));

  const handleNextSlide = () => {
    const totalSlides = Math.ceil(offers.length / 3);
    if (currentSlide < totalSlides - 1) setCurrentSlide((s) => s + 1);
  };
  const handlePrevSlide = () => {
    if (currentSlide > 0) setCurrentSlide((s) => s - 1);
  };

  const getCategoryIcon = (cat: Category) => {
    switch (cat) {
      case "Books": return <Book className="w-4 h-4" />;
      case "Museums": return <Building2 className="w-4 h-4" />;
      case "Library": return <Library className="w-4 h-4" />;
      case "Cinema": return <Film className="w-4 h-4" />;
    }
  };

  return (
    <div className="w-full p-6 bg-gray-50">
      {/* Header & Tabs */}
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#2e4057]">Partner Management</h1>
        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab("approved")}
            className={`px-4 py-2 rounded-md ${activeTab === "approved" ? "bg-white text-[#ff6b6b] shadow-sm" : "text-gray-600 hover:bg-gray-50"}`}>
            <CheckCircle className="inline-block mr-2 h-5 w-5" /> Approved ({partnersApproved.length})
          </button>
          <button
            onClick={() => setActiveTab("unapproved")}
            className={`px-4 py-2 rounded-md ${activeTab === "unapproved" ? "bg-white text-[#ff6b6b] shadow-sm" : "text-gray-600 hover:bg-gray-50"}`}>
            <XCircle className="inline-block mr-2 h-5 w-5" /> Pending ({partnersNotApproved.length})
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Partners</p>
              <h3 className="text-2xl font-bold text-[#2e4057] mt-1">{allPartners.length}</h3>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">New Partners (30 days)</p>
              <h3 className="text-2xl font-bold text-[#2e4057] mt-1">{allPartners.filter(p => p.createdAt && new Date(p.createdAt) > new Date(Date.now() - 30*24*60*60*1000)).length}</h3>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Most Popular Category</p>
              <h3 className="text-2xl font-bold text-[#2e4057] mt-1">{partnerCategories.sort((a,b) => categoryCount[b] - categoryCount[a])[0] || 'None'}</h3>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Approval</p>
              <h3 className="text-2xl font-bold text-[#2e4057] mt-1">{partnersNotApproved.length}</h3>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <XCircle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      
      <CategoryFilter
        categories={partnerCategories}
        counts={{ All: allPartners.length, ...categoryCount }}
        selected={selectedCategory}
        onChange={(cat: string) => setSelectedCategory(cat as CategoryFilterType)}
      />
      
      {/* Partners Table */}
      {partnersLoading ? (
        <div className="text-center p-8">
          <Loader className="w-8 h-8 animate-spin mx-auto text-[#2e4057]" />
        </div>
      ) : partnersError ? (
        <div className="bg-red-50 p-4 rounded-lg text-red-600">{partnersError}</div>
      ) : (
        <div  className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full h-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#2e4057]">Organization</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#2e4057]">Contact</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#2e4057]">Location</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#2e4057]">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#2e4057]">Website</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#2e4057]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPartners.map((p) => (
                  <tr
                    key={p._id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleViewPartner(p)}
                  >
                    <td className="px-6 py-4 text-sm text-[#2e4057] font-medium">{p.businessName}</td>
                    <td className="px-6 py-4 text-sm text-[#82a0b6]">
                      <div>{p.email}</div>
                      <div className="text-xs mt-1">{p.firstName} {p.lastName}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#82a0b6]">{p.location}</td>
                    <td className="px-6 py-4">
                      {p.categories?.map((c, i) => (
                        <span key={i} className="px-3 py-1 rounded-full bg-[#ff6b6b]/10 text-[#ff6b6b] text-xs font-medium flex items-center gap-1 w-fit mb-1">
                          {getCategoryIcon(c)} {c}
                        </span>
                      ))}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#82a0b6]">
                      <a
                        href={p.websiteURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#2e4057] hover:text-[#ff6b6b] transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Visit Site
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-3" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => handleViewPartner(p)}>
                          <Eye className="w-5 h-5 text-blue-500 hover:text-blue-700 transition-colors" />
                        </button>
                        {activeTab === "unapproved" && (
                          <button onClick={() => handleApprovePartner(p._id)}>
                            <CircleCheckBig className="w-5 h-5 text-green-500 hover:text-green-700 transition-colors" />
                          </button>
                        )}
                        <button onClick={() => handleDeletePartner(p._id)}>
                          <Trash2 className="w-5 h-5 text-red-500 hover:text-red-700 transition-colors" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredPartners.length === 0 && (
            <div className="p-8 text-center text-[#82a0b6]">
              No {activeTab === "approved" ? "approved" : "pending"} partners found
              {selectedCategory !== "All" && ` in ${selectedCategory} category`}
            </div>
          )}
        </div>
      )}

      {/* Partner Detail Modal */}
      {selectedPartner && (
        <PartnerModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="flex flex-col md:flex-row gap-6 max-w-4xl mx-auto">
            {/* Left */}
            <div className="md:w-1/3">
              <div className="rounded-lg overflow-hidden shadow-md mb-4">
                <img src={selectedPartner.imageUrl} alt={selectedPartner.businessName} className="w-full h-auto object-cover" />
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h2 className="text-lg font-bold text-[#2e4057] mb-3">{selectedPartner.businessName}</h2>
                <div className="space-y-3 text-sm text-[#82a0b6]">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#ff6b6b]" />
                    <span>{selectedPartner.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#ff6b6b]" />
                    <span>Joined {selectedPartner.createdAt ? new Date(selectedPartner.createdAt).toLocaleDateString() : "-"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#ff6b6b]" />
                    <a href={selectedPartner.websiteURL} target="_blank" rel="noopener noreferrer" className="hover:text-[#ff6b6b] transition-colors">
                      Visit Website
                    </a>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  {selectedPartner.categories?.map((c, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-[#ff6b6b]/10 text-[#ff6b6b] text-xs font-medium flex items-center gap-1 w-fit">
                      {getCategoryIcon(c)} {c}
                    </span>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className={`flex items-center gap-1 text-sm ${selectedPartner.isApproved ? "text-green-600" : "text-yellow-600"}`}>
                    {selectedPartner.isApproved ? (
                      <>
                        <CheckCircle className="w-4 h-4" /> Approved
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4" /> Pending Approval
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="md:w-2/3">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-[#2e4057] mb-3">About {selectedPartner.businessName}</h3>
                <p className="text-[#82a0b6]">{selectedPartner.description}</p>
              </div>
              <div className="mb-6">
                <h3 className="text-lg font-bold text-[#2e4057] mb-3">Contact Information</h3>
                <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-[#82a0b6]">
                      <User className="w-4 h-4 text-[#ff6b6b]" /> Contact Person
                    </div>
                    <p className="text-[#2e4057] ml-6 mt-1">{selectedPartner.firstName} {selectedPartner.lastName}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-sm text-[#82a0b6]">
                      <Mail className="w-4 h-4 text-[#ff6b6b]" /> Email
                    </div>
                    <p className="text-[#2e4057] ml-6 mt-1">{selectedPartner.email}</p>
                  </div>
                </div>
              </div>

              {/* Offers Slider */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-bold text-[#2e4057]">Featured Offers</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={handlePrevSlide}
                      disabled={currentSlide === 0}
                      className={`p-1 rounded-full ${
                        currentSlide === 0 ? "text-gray-300 cursor-not-allowed" : "text-[#2e4057] hover:bg-gray-100"
                      }`}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleNextSlide}
                      disabled={currentSlide >= Math.ceil(offers.length / 3) - 1}
                      className={`p-1 rounded-full ${
                        currentSlide >= Math.ceil(offers.length / 3) - 1 ? "text-gray-300 cursor-not-allowed" : "text-[#2e4057] hover:bg-gray-100"
                      }`}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                {offersLoading ? (
                  <div className="text-center p-8">
                    <Loader className="w-8 h-8 animate-spin mx-auto text-[#2e4057]" />
                  </div>
                ) : offersError ? (
                  <div className="text-red-500 text-center">{offersError}</div>
                ) : (
                  <div className="relative overflow-hidden">  
                    <div
                      ref={slideRef}
                      className="flex transition-transform duration-300 ease-in-out"
                      style={{ transform: `translateX(-${currentSlide * (100 / Math.ceil(offers.length / 3))}%)` }}
                    >
                      {offers.map(o => (
                        <div key={o._id} className="min-w-[33.333%] px-2">
                          <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
                            <div className="h-32 overflow-hidden">
                              <img
                                src={o.imageUrl}
                                alt={o.title}
                                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                            <div className="p-3">
                              <h4 className="font-medium text-[#2e4057] truncate">{o.title}</h4>
                              <div className="flex justify-between items-center mt-2">
                                <span className="text-sm text-[#ff6b6b] font-medium">
                                  {o.price}€
                                </span>
                                <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                                  {o.categories}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
                {!selectedPartner.isApproved && (
                  <Button
                    variant="primary"
                    onClick={() => {
                      setIsModalOpen(false);
                      handleApprovePartner(selectedPartner._id);
                    }}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" /> Approve Partner
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsModalOpen(false);
                    handleDeletePartner(selectedPartner._id);
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Delete Partner
                </Button>
              </div>
            </div>
          </div>
        </PartnerModal>
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={closeConfirmDialog}
        onConfirm={confirmAction}
        title={confirmDialog.title}
        message={confirmDialog.message}
      />
    </div>
  );
};

export default PartnersPage;
