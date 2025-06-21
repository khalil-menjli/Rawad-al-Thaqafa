import {
  Image,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
  Modal,
  Dimensions,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { OffersStore } from "@/store/offerStore";
import { icons, images } from "@/constants";
import { Offer } from "@/types/type.t";

const OfferDetails = () => {
  const params = useLocalSearchParams<{ id: string }>();
  const [offer, setOffer] = useState<Offer | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [reservationLoading, setReservationLoading] = useState(false);
  const [reservationStatus, setReservationStatus] = useState<any>(null);
  const [checkingStatus, setCheckingStatus] = useState(true);

  const windowHeight = Dimensions.get("window").height;
  
  const { 
    loading, 
    error, 
    getOfferById,
    createReservation,
    getMyReservations,
    reservations,
    checkReservationStatus
  } = OffersStore();

  useEffect(() => {
    const fetchOfferDetails = async () => {
      if (params.id) {
        const offerData = await getOfferById(params.id);
        if (offerData) {
          setOffer(offerData);
          // Check reservation status after getting offer
          await checkReservationStatusForOffer(params.id);
        }
      }
    };

    const fetchUserReservations = async () => {
      await getMyReservations();
    };

    const checkReservationStatusForOffer = async (offerId: string) => {
      setCheckingStatus(true);
      try {
        const status = await checkReservationStatus(offerId);
        setReservationStatus(status);
      } catch (error) {
        console.error('Error checking reservation status:', error);
      } finally {
        setCheckingStatus(false);
      }
    };

    fetchOfferDetails();
    fetchUserReservations();
  }, [params.id]);

  const handleReservation = () => {
    // Check if user has enough points
    if (reservationStatus && !reservationStatus.canReserve) {
      if (reservationStatus.hasReservation) {
        Alert.alert(
          "Already Reserved",
          "You have already reserved this offer.",
          [{ text: "OK" }]
        );
        return;
      }
      
      if (reservationStatus.userPoints < reservationStatus.offerPoints) {
        Alert.alert(
          "Insufficient Points",
          `You need ${reservationStatus.offerPoints} points but only have ${reservationStatus.userPoints} points.`,
          [{ text: "OK" }]
        );
        return;
      }
    }
    
    setShowConfirmModal(true);
  };

  const confirmReservation = async () => {
    if (!offer) return;
    
    setReservationLoading(true);
    try {
      // Call the actual reservation API from OffersStore
      const reservation = await createReservation(offer._id);
      
      if (reservation) {
        setShowConfirmModal(false);
        
        // Update reservation status
        setReservationStatus({
          ...reservationStatus,
          hasReservation: true,
          canReserve: false,
          reservationId: reservation._id
        });
        
        Alert.alert(
          "Reservation Confirmed!",
          `Your reservation for "${offer.title}" has been confirmed. Points have been deducted from your account.`,
          [{ text: "OK" }]
        );
      } else {
        Alert.alert(
          "Reservation Failed",
          "Unable to complete your reservation. Please try again.",
          [{ text: "OK" }]
        );
      }
    } catch (error: any) {
      console.error('Reservation error:', error);
      
      // Show specific error message from the API
      const errorMessage = error.message || "Unable to complete your reservation. Please try again.";
      
      Alert.alert(
        "Reservation Failed",
        errorMessage,
        [{ text: "OK" }]
      );
    } finally {
      setReservationLoading(false);
    }
  };

  const cancelReservation = () => {
    setShowConfirmModal(false);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Helper function to safely render creator information
  const renderCreatorInfo = (createdBy: any) => {
    if (!createdBy) return null;
    
    // If createdBy is an object with user details
    if (typeof createdBy === 'object' && createdBy._id) {
      const displayName = createdBy.firstName && createdBy.lastName 
        ? `${createdBy.firstName} ${createdBy.lastName}`
        : createdBy.email || 'Partner';
      
      return (
        <View className="w-full border-t border-primary-200 pt-7 mt-5">
          <Text className="text-black-300 text-xl font-rubik-bold">
            Offered By
          </Text>

          <View className="flex flex-row items-center justify-between mt-4">
            <View className="flex flex-row items-center">
              <Image
                source={images.signCover}
                className="size-14 rounded-full"
              />

              <View className="flex flex-col items-start justify-center ml-3">
                <Text className="text-lg text-black-300 text-start font-rubik-bold">
                  {displayName}
                </Text>
                <Text className="text-sm text-black-200 text-start font-rubik-medium">
                  {createdBy.role || 'Partner'}
                </Text>
              </View>
            </View>

            <View className="flex flex-row items-center gap-3">
              <Image source={icons.chat} className="size-7" />
              <Image source={icons.phone} className="size-7" />
            </View>
          </View>
        </View>
      );
    }
    
    // If createdBy is just a string ID
    if (typeof createdBy === 'string') {
      return (
        <View className="w-full border-t border-primary-200 pt-7 mt-5">
          <Text className="text-black-300 text-xl font-rubik-bold">
            Offered By
          </Text>

          <View className="flex flex-row items-center justify-between mt-4">
            <View className="flex flex-row items-center">
              <Image
                source={images.signCover}
                className="size-14 rounded-full"
              />

              <View className="flex flex-col items-start justify-center ml-3">
                <Text className="text-lg text-black-300 text-start font-rubik-bold">
                  Partner
                </Text>
                <Text className="text-sm text-black-200 text-start font-rubik-medium">
                  ID: {createdBy}
                </Text>
              </View>
            </View>

            <View className="flex flex-row items-center gap-3">
              <Image source={icons.chat} className="size-7" />
              <Image source={icons.phone} className="size-7" />
            </View>
          </View>
        </View>
      );
    }
    
    return null;
  };

  // Function to render the reservation button based on status
  const renderReservationButton = () => {
    if (checkingStatus) {
      return (
        <TouchableOpacity 
          className="flex-1 flex flex-row items-center justify-center bg-gray-300 py-3 rounded-full"
          disabled={true}
        >
          <ActivityIndicator color="white" size="small" />
          <Text className="text-white text-lg text-center font-rubik-bold ml-2">
            Checking...
          </Text>
        </TouchableOpacity>
      );
    }

    if (reservationStatus?.hasReservation) {
      return (
        <TouchableOpacity 
          className="flex-1 flex flex-row items-center justify-center bg-green-500 py-3 rounded-full"
          disabled={true}
        >
          <Text className="text-white text-lg text-center font-rubik-bold">
            Already Reserved
          </Text>
        </TouchableOpacity>
      );
    }

    const canReserve = reservationStatus?.canReserve ?? true;
    const hasInsufficientPoints = reservationStatus && reservationStatus.userPoints < reservationStatus.offerPoints;

    return (
      <TouchableOpacity 
        className={`flex-1 flex flex-row items-center justify-center py-3 rounded-full shadow-md shadow-zinc-400 ${
          canReserve ? 'bg-primary-200' : 'bg-gray-400'
        }`}
        onPress={handleReservation}
        disabled={!canReserve}
      >
        <Text className="text-white text-lg text-center font-rubik-bold">
          {hasInsufficientPoints ? 'Insufficient Points' : 'Reserve Now'}
        </Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" className="text-primary-300" />
        <Text className="mt-2 text-gray-600 font-rubik">Loading offer...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center px-5">
        <Text className="text-red-500 text-center font-rubik mb-4">{error}</Text>
        <TouchableOpacity 
          onPress={() => router.back()}
          className="px-4 py-2 bg-primary-300 rounded"
        >
          <Text className="text-white font-rubik-medium">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (!offer) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center px-5">
        <Text className="text-gray-600 text-center font-rubik-medium mb-4">
          Offer not found
        </Text>
        <TouchableOpacity 
          onPress={() => router.back()}
          className="px-4 py-2 bg-primary-300 rounded"
        >
          <Text className="text-white font-rubik-medium">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-red-50">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-32"
      >
        {/* Hero Image Section */}
        <View className="relative w-full" style={{ height: windowHeight / 2 }}>
          <Image
            source={{ uri: `${process.env.EXPO_PUBLIC_API_URL}/${offer.imageUrl}` }}
            className="size-full"
            resizeMode="cover"
          />
          <Image
            source={images.whiteGradient}
            className="absolute top-0 w-full z-40"
          />

          <View
            className="z-50 absolute inset-x-7"
            style={{
              top: Platform.OS === "ios" ? 70 : 20,
            }}
          >
            <View className="flex flex-row items-center w-full justify-between">
              <TouchableOpacity
                onPress={() => router.back()}
                className="flex flex-row bg-primary-200 rounded-full size-11 items-center justify-center"
              >
                <Image source={icons.backArrow} className="size-5" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Offer Details */}
        <View className="px-5 mt-7 flex gap-2">
          <Text className="text-2xl font-rubik-extrabold">
            {offer.title}
          </Text>

          <View className="flex flex-row items-center gap-3">
            <View className="flex flex-row items-center px-4 py-2 bg-primary-100 rounded-full">
              <Text className="text-xs font-rubik-bold text-white">
                {offer.categories}
              </Text>
            </View>

            {offer.views && (
              <View className="flex flex-row items-center gap-2">
                <Image source={icons.checkmark} className="size-5" />
                <Text className="text-black-200 text-sm mt-1 font-rubik-medium">
                  {offer.views} views
                </Text>
              </View>
            )}
          </View>

          {/* Points Status Display */}
          {reservationStatus && (
            <View className="flex flex-row items-center justify-between mt-3 bg-blue-50 p-3 rounded-lg">
              <View>
                <Text className="text-sm text-gray-600 font-rubik">Your Points:</Text>
                <Text className="text-lg font-rubik-bold text-blue-600">
                  {reservationStatus.userPoints}
                </Text>
              </View>
              <View>
                <Text className="text-sm text-gray-600 font-rubik">Required:</Text>
                <Text className="text-lg font-rubik-bold text-primary-300">
                  {reservationStatus.offerPoints}
                </Text>
              </View>
            </View>
          )}

          {/* Offer Stats */}
          <View className="flex flex-row items-center mt-5">
            <View className="flex flex-row items-center justify-center bg-primary-100 rounded-full size-10">
              <Image source={icons.calendar} className="size-4" />
            </View>
            <Text className="text-black-300 text-sm font-rubik-medium ml-2">
              Available from {formatDate(offer.dateStart)}
            </Text>
            
            {offer.reservation && (
              <>
                <View className="flex flex-row items-center justify-center bg-primary-100 rounded-full size-10 ml-7">
                  <Image source={icons.people} className="size-4" />
                </View>
                <Text className="text-black-300 text-sm font-rubik-medium ml-2">
                  {offer.reservation} reservations
                </Text>
              </>
            )}
          </View>

          {/* Description */}
          <View className="mt-7">
            <Text className="text-black-300 text-xl font-rubik-bold">
              Description
            </Text>
            <Text className="text-black-200 text-base font-rubik mt-2">
              {offer.description}
            </Text>
          </View>

          {/* Location */}
          <View className="mt-7">
            <Text className="text-black-300 text-xl font-rubik-bold">
              Location
            </Text>
            <View className="flex flex-row items-center justify-start mt-4 gap-2">
              <Image source={icons.location} className="w-7 h-7" />
              <Text className="text-black-200 text-sm font-rubik-medium">
                {offer.location}
              </Text>
            </View>
          </View>

          {/* Creator/Partner Info (if available) */}
          {renderCreatorInfo(offer.createdBy)}

          {/* Offer Stats Summary */}
          <View className="mt-7 bg-primary-50 p-4 rounded-xl">
            <Text className="text-black-300 text-lg font-rubik-bold mb-3">
              Offer Summary
            </Text>
            <View className="space-y-2">
              <View className="flex flex-row justify-between">
                <Text className="text-black-200 font-rubik">Price:</Text>
                <Text className="text-primary-200 font-rubik-bold">{offer.price}</Text>
              </View>
              <View className="flex flex-row justify-between">
                <Text className="text-black-200 font-rubik">Category:</Text>
                <Text className="text-black-300 font-rubik-medium">{offer.categories}</Text>
              </View>
              <View className="flex flex-row justify-between">
                <Text className="text-black-200 font-rubik">Available from:</Text>
                <Text className="text-black-300 font-rubik-medium">{formatDate(offer.dateStart)}</Text>
              </View>
              {offer.views && (
                <View className="flex flex-row justify-between">
                  <Text className="text-black-200 font-rubik">Views:</Text>
                  <Text className="text-black-300 font-rubik-medium">{offer.views}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Reservation Section */}
      <View className="absolute bg-white bottom-0 w-full rounded-t-2xl border-t border-r border-l border-primary-200 p-7">
        <View className="flex flex-row items-center justify-between gap-10">
          <View className="flex flex-col items-start">
            <Text className="text-black-200 text-xs font-rubik-medium">
              Price
            </Text>
            <Text
              numberOfLines={1}
              className="text-primary-200 text-start text-2xl font-rubik-bold"
            >
              {offer.price}
            </Text>
          </View>

          {renderReservationButton()}
        </View>
      </View>

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmModal}
        transparent={true}
        animationType="slide"
        onRequestClose={cancelReservation}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-lg p-6 mx-5 w-11/12 max-w-sm">
            <Text className="text-xl font-rubik-bold text-black-300 mb-3 text-center">
              Confirm Reservation
            </Text>
            
            <View className="items-center mb-4">
              <Image
                source={{ uri: `${process.env.EXPO_PUBLIC_API_URL}/${offer.imageUrl}` }}
                className="w-20 h-20 rounded-lg mb-3"
                resizeMode="cover"
              />
              <Text className="text-base font-rubik-bold text-black-300 text-center mb-2">
                {offer.title}
              </Text>
              <Text className="text-lg font-rubik-bold text-primary-300 mb-1">
                {offer.price}
              </Text>
              <Text className="text-sm text-gray-600 font-rubik text-center">
                {offer.location}
              </Text>
            </View>
            
            {reservationStatus && (
              <View className="bg-blue-50 p-3 rounded-lg mb-4">
                <Text className="text-sm text-center text-gray-600 font-rubik">
                  {reservationStatus.offerPoints} points will be deducted
                </Text>
                <Text className="text-sm text-center text-gray-600 font-rubik">
                  Remaining: {reservationStatus.userPoints - reservationStatus.offerPoints} points
                </Text>
              </View>
            )}
            
            <Text className="text-sm text-gray-600 font-rubik mb-6 text-center">
              Are you sure you want to reserve this offer?
            </Text>
            
            <View className="flex-row justify-between">
              <TouchableOpacity
                className="flex-1 bg-gray-200 py-3 rounded-lg mr-2 items-center"
                onPress={cancelReservation}
                disabled={reservationLoading}
              >
                <Text className="text-gray-700 font-rubik-medium">
                  Cancel
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                className="flex-1 bg-primary-300 py-3 rounded-lg ml-2 items-center"
                onPress={confirmReservation}
                disabled={reservationLoading}
              >
                {reservationLoading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text className="text-primary-200 font-rubik-medium">
                    Confirm
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default OfferDetails;