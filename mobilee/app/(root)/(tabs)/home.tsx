import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";


import { Card, FeaturedCard } from "@/components/Cards";

import { OffersStore } from "@/store/offerStore";
import { icons, images } from "@/constants";
import Search from "@/components/Search";
import NoResults from "@/components/NoResults";
import Filters from "@/components/Filters";

const Home = () => {
  //const { user } = useGlobalContext();
  
  const params = useLocalSearchParams<{ query?: string; filter?: string }>();

  // Use Zustand store instead of useAppwrite
  const { 
    offers, 
    loading, 
    error, 
    fetchOffers 
  } = OffersStore();

  // For featured properties, you might want to create separate endpoints
  // or filter the existing offers. For now, using the same data
  const latestProperties = offers?.slice(0, 3) || []; // Get first 5 as featured
  const latestPropertiesLoading = loading;

  // Filter properties based on search params
  const filteredProperties = offers?.filter(offer => {
    let matches = true;
    
    if (params.query) {
      const query = params.query.toLowerCase();
      matches = matches && (
        offer.title?.toLowerCase().includes(query) ||
        offer.location?.toLowerCase().includes(query) ||
        offer.description?.toLowerCase().includes(query)
      );
    }
    
    if (params.filter && params.filter !== 'All') {
      // Adjust this based on your filter logic
      matches = matches && offer.categories === params.filter;
    }
    
    return matches;
  }) || [];

  useEffect(() => {
    // Fetch offers when component mounts
    fetchOffers();
  }, []);

  useEffect(() => {
    // Refetch when search params change
    // Since we're filtering client-side, we don't need to refetch from server
    // But if you want server-side filtering, you can modify your API and store
    fetchOffers();
  }, [params.filter, params.query]);

  const handleCardPress = (id: string) => {
    // Update to use your ID field (_id instead of $id)
    router.push(`/offer/${id}`);
  };

  return (
    <SafeAreaView className="h-full bg-red-50">
      <FlatList
        data={filteredProperties}
        numColumns={2}
        renderItem={({ item }) => (
          <Card 
            item={item} 
            onPress={() => handleCardPress(item._id)} // Use _id instead of $id
          />
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
              <Text className="text-red-500 text-center">{error}</Text>
              <TouchableOpacity 
                onPress={fetchOffers}
                className="mt-4 px-4 py-2 bg-primary-300 rounded"
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
              <View className="flex flex-row">
                <Image
                  /* source={{ uri: user?.avatar }} */
                  source={images.signCover}
                  className="size-12 rounded-full"
                />

                <View className="flex flex-col items-start ml-2 justify-center">
                  <Text className="text-xs font-rubik text-black-100">
                    Good Morning
                  </Text>
                  <Text className="text-base font-rubik-medium text-black-300">
                    Khalil Menjli
                  </Text>
                </View>
              </View>
              <Image source={icons.bell} className="size-6" />
            </View>


            <View className="my-5">
              <View className="flex flex-row items-center justify-between">
                <Text className="text-xl font-rubik-bold text-black-300">
                  Featured
                </Text>
                <TouchableOpacity>
                  <Text className="text-base font-rubik-bold text-primary-300">
                    See all
                  </Text>
                </TouchableOpacity>
              </View>

              {latestPropertiesLoading ? (
                <ActivityIndicator size="large" className="text-primary-300" />
              ) : !latestProperties || latestProperties.length === 0 ? (
                <NoResults />
              ) : (
                <FlatList
                  data={latestProperties}
                  renderItem={({ item }) => (
                    <FeaturedCard
                      item={item}
                      onPress={() => handleCardPress(item._id)} // Use _id instead of $id
                    />
                  )}
                  keyExtractor={(item) => item._id} // Use _id instead of $id
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerClassName="flex gap-5 mt-5"
                />
              )}
            </View>

            <View className="mt-5">
              <View className="flex flex-row items-center justify-between">
                <Text className="text-xl font-rubik-bold text-black-300">
                  Our Recommendation
                </Text>
                <TouchableOpacity>
                  <Text className="text-base font-rubik-bold text-primary-300">
                    See all
                  </Text>
                </TouchableOpacity>
              </View>

              <Filters />
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default Home;