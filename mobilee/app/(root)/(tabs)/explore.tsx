import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import Search from "@/components/Search";
import { Card } from "@/components/Cards";
import Filters from "@/components/Filters";
import NoResults from "@/components/NoResults";
import { OffersStore } from "@/store/offerStore";
import { icons } from "@/constants";
import { SafeAreaView } from "react-native-safe-area-context";

const Explore = () => {
  const params = useLocalSearchParams<{ query?: string; filter?: string }>();
  
  // Use Zustand store instead of useAppwrite
  const { 
    offers, 
    loading, 
    error, 
    fetchOffers 
  } = OffersStore();

  // Filter offers based on search params (client-side filtering)
  const filteredOffers = offers?.filter(offer => {
    let matches = true;
    
    // Search query filtering
    if (params.query) {
      const query = params.query.toLowerCase();
      matches = matches && (
        offer.title?.toLowerCase().includes(query) ||
        offer.description?.toLowerCase().includes(query) ||
        offer.location?.toLowerCase().includes(query) ||
        offer.categories?.toLowerCase().includes(query)
      );
    }
    
    // Category filter
    if (params.filter && params.filter !== 'All') {
      matches = matches && offer.categories === params.filter;
    }
    
    return matches;
  }) || [];

  useEffect(() => {
    // Fetch offers when component mounts or params change
    fetchOffers();
  }, [params.filter, params.query]);

  const handleCardPress = (id: string) => {
    // Use _id instead of $id for MongoDB
    router.push(`/offer/${id}`);
  };

  return (
    <SafeAreaView className="h-full bg-white">
      <FlatList
        data={filteredOffers}
        numColumns={2}
        renderItem={({ item }) => (
          <Card item={item} onPress={() => handleCardPress(item._id)} />
        )}
        keyExtractor={(item) => item._id} // Use _id instead of $id
        contentContainerClassName="pb-32"
        columnWrapperClassName="flex gap-5 px-5"
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" className="text-primary-300 mt-5" />
          ) : error ? (
            <View className="flex-1 justify-center items-center mt-10">
              <Text className="text-red-500 text-center mb-2">{error}</Text>
              <TouchableOpacity 
                onPress={fetchOffers}
                className="px-4 py-2 bg-primary-300 rounded"
              >
                <Text className="text-white">Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <NoResults />
          )
        }
        ListHeaderComponent={() => (
          <View className="px-5">
            <View className="flex flex-row items-center justify-between mt-5">
              <TouchableOpacity
                onPress={() => router.back()}
                className="flex flex-row bg-primary-200 rounded-full size-11 items-center justify-center"
              >
                <Image source={icons.backArrow} className="size-5" />
              </TouchableOpacity>
              <Text className="text-base mr-2 text-center font-rubik-medium text-black-300">
                Search for Your Ideal Offers
              </Text>
              <Image source={icons.bell} className="w-6 h-6" />
            </View>
            <Search />
            <View className="mt-5">
              <Filters />
              <Text className="text-xl font-rubik-bold text-black-300 mt-5">
                Found {filteredOffers?.length || 0} Offers
              </Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default Explore;