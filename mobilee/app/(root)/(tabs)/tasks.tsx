import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { icons, images } from '@/constants';
import { TasksStore } from '@/store/taskStore';

const Tasks = () => {
  // Replace static data with store
  const {
    tasks,
    loading,
    claimLoading,
    fetchTasks,
    claimTask,
  } = TasksStore();

  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleClaimPress = (taskId: string) => {
    setSelectedTask(taskId);
    setConfirmModalVisible(true);
  };

  const handleConfirmClaim = async () => {
    if (!selectedTask) return;
    setConfirmModalVisible(false);
    const result = await claimTask(selectedTask);

    if (result.success) {
      Alert.alert(
        'Success!',
        `You've successfully claimed ${result.pointsAwarded} points!`,
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert('Error', 'Failed to claim reward.');
    }

    setSelectedTask(null);
  };

  const getProgressPercentage = (required: number, done: number) => {
    return Math.min((done / required) * 100, 100);
  };

  const getStatusColor = (status) => {
    if (status.isClaimed) return 'bg-green-500';
    if (status.isCompleted) return 'bg-primary-200';
    return 'bg-gray-400';
  };

  const getStatusText = (status) => {
    if (status.isClaimed) return 'Claimed';
    if (status.isCompleted) return 'Completed';
    return `${status.done}/${status.required}`;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Books':
        return 'text-blue-600';
      case 'Cinema':
        return 'text-red-600';
      case 'Museums':
        return 'text-purple-600';
      default:
        return 'text-primary-300';
    }
  };

  const renderTaskCard = ({ item: task }) => {
    const { status } = task;
    const progressPercentage = getProgressPercentage(
      status.required,
      status.done
    );
    const isClaimDisabled = !status.isCompleted || status.isClaimed;
    const isCurrentlyClaiming = claimLoading === task._id;

    return (
      <View className="bg-white mx-5 mb-4 p-4 rounded-xl shadow-lg shadow-black-100/10">
        {/* Header */}
        <View className="flex-row justify-between items-start mb-3">
          <View className="flex-1 mr-3">
            <Text className="text-lg font-rubik-bold text-black-300 mb-1">
              {task.title}
            </Text>
            <Text className="text-sm font-rubik text-black-100" numberOfLines={2}>
              {task.description}
            </Text>
          </View>
          <View className={`px-3 py-1 rounded-full ${getStatusColor(status)}`}>
            <Text className="text-xs font-rubik-medium text-white">
              {getStatusText(status)}
            </Text>
          </View>
        </View>

        {/* Progress */}
        <View className="mb-3">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-sm font-rubik text-black-200">
              Progress: {status.done}/{status.required}
            </Text>
            <Text className="text-sm font-rubik-medium text-primary-200">
              {Math.round(progressPercentage)}%
            </Text>
          </View>
          <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <View
              className="h-full bg-primary-200 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </View>
        </View>

        {/* Details */}
        <View className="flex-row justify-between items-center mb-3">
          <View className="flex-row items-center">
            <Image source={icons.star} className="w-4 h-4 mr-1" />
            <Text className="text-sm font-rubik-medium text-black-300">
              {task.pointToWin} Points
            </Text>
          </View>
          <View className="flex-row items-center">
            <Text className="text-xs font-rubik text-black-100 mr-1">
              Category:
            </Text>
            <Text className={`text-xs font-rubik-medium ${getCategoryColor(task.category)}`}>
              {task.category}
            </Text>
          </View>
        </View>

        {/* Claim Button */}
        <TouchableOpacity
          onPress={() => handleClaimPress(task._id)}
          disabled={isClaimDisabled || isCurrentlyClaiming}
          className={`py-3 px-4 rounded-lg flex-row justify-center items-center ${
            isClaimDisabled ? 'bg-gray-300' : 'bg-primary-200'
          }`}
        >
          {isCurrentlyClaiming ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <>
              <Image
                source={icons.star}
                className="w-4 h-4 mr-2"
                tintColor="white"
              />
              <Text className={`font-rubik-medium text-base ${
                isClaimDisabled ? 'text-gray-600' : 'text-white'
              }`}>
                {status.isClaimed
                  ? 'Already Claimed'
                  : status.isCompleted
                  ? 'Claim Reward'
                  : 'In Progress'}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView className="h-full bg-red-50">
      <FlatList
        data={tasks}
        renderItem={renderTaskCard}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-20"
        ListEmptyComponent={
          loading ? (
            <View className="flex-1 justify-center items-center mt-20">
              <ActivityIndicator size="large" className="text-primary-300" />
              <Text className="text-black-100 font-rubik mt-2">Loading tasks...</Text>
            </View>
          ) : (
            <View className="flex-1 justify-center items-center mt-20">
              <Text className="text-black-100 font-rubik">No tasks available</Text>
            </View>
          )
        }
        ListHeaderComponent={() => (
          <View className="px-5">
            <View className="flex flex-row items-center justify-between mt-5">
              <View className="flex flex-row">
                <Image
                  source={images.signCover}
                  className="size-12 rounded-full"
                />
                <View className="flex flex-col items-start ml-2 justify-center">
                  <Text className="text-xs font-rubik text-black-100">Good Morning</Text>
                  <Text className="text-base font-rubik-medium text-black-300">{ /* You can show user fetched from store if available */ }</Text>
                </View>
              </View>

              <View className="flex flex-row items-center bg-primary-200 px-4 py-2 rounded-full shadow-sm">
                <Image source={icons.star} className="w-4 h-4 mr-2" tintColor="white" />
                <Text className="text-sm font-rubik-bold text-white">702</Text>
              </View>
            </View>

            <View className="bg-white p-4 rounded-xl shadow-sm mb-5 my-5">
              <Text className="text-sm font-rubik-bold text-black-300 mb-3">Categories Overview</Text>
              <View className="flex-row justify-between">
                <View className="items-center">
                  <Text className="text-xs font-rubik text-primary-200 mb-1">Books</Text>
                  <Text className="text-lg font-rubik-bold text-black-300">
                    {tasks.filter(t => t.category === 'Books').length}
                  </Text>
                </View>
                <View className="items-center">
                  <Text className="text-xs font-rubik text-red-600 mb-1">Cinema</Text>
                  <Text className="text-lg font-rubik-bold text-black-300">
                    {tasks.filter(t => t.category === 'Cinema').length}
                  </Text>
                </View>
                <View className="items-center">
                  <Text className="text-xs font-rubik text-purple-600 mb-1">Museums</Text>
                  <Text className="text-lg font-rubik-bold text-black-300">
                    {tasks.filter(t => t.category === 'Museums').length}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}
        refreshing={loading}
        onRefresh={fetchTasks}
      />

      <Modal
        visible={confirmModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setConfirmModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-5">
          <View className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <View className="items-center mb-4">
              <View className="bg-primary-200 w-16 h-16 rounded-full items-center justify-center mb-3">
                <Image source={icons.star} className="w-8 h-8" tintColor="white" />
              </View>
              <Text className="text-xl font-rubik-bold text-black-300 mb-2 text-center">
                Claim Reward
              </Text>
              <Text className="text-sm font-rubik text-black-100 text-center">
                You're about to claim reward for this task.
              </Text>
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setConfirmModalVisible(false)}
                className="flex-1 py-3 bg-gray-200 rounded-lg"
              >
                <Text className="text-center font-rubik-medium text-black-300">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleConfirmClaim}
                className="flex-1 py-3 bg-primary-200 rounded-lg"
              >
                <Text className="text-center font-rubik-medium text-white">Claim Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Tasks;
