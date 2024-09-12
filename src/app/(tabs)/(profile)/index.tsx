import { cld } from '@/src/lib/cloudinary';
import { supabase } from '@/src/lib/supabase';
import { useAuth } from '@/src/providers/AuthProvider';
import { AdvancedImage } from 'cloudinary-react-native';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, Dimensions, TouchableOpacity } from 'react-native';
import { thumbnail } from "@cloudinary/url-gen/actions/resize";

const { width } = Dimensions.get('window');

export default function Index() {
  const { user } = useAuth();
  const [avatar, setAvatar] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>('New User');
  const [totalLearnTime, setTotalLearnTime] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeSpentRef = useRef<number>(0);
  const [level, setLevel] = useState<number>(0);
  const [userLevel, setUserLevel] = useState<string | null>(null);

  const formatTime = (totalTimeInMinutes: number) => {
    const hours = Math.floor(totalTimeInMinutes / 60);
    return `${hours}h`; // Display as "Xh"
  };

  const fetchUserData = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) {
        throw error;
      }
      setAvatar(data.avatar_url);
      setUserName(data.username);

      const learnTimeInMinutes = Number(data.total_learn_time) * 60;
      if (!isNaN(learnTimeInMinutes)) {
        const formattedLearnTime = formatTime(learnTimeInMinutes);
        setTotalLearnTime(formattedLearnTime);
      } else {
        setTotalLearnTime('Loading...'); // or handle error
      }

    } catch (error: any) {
      console.log('Error fetching user data:', error.message);
    }
  };

  const getLevel = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('level')
        .eq('id', user?.id)
        .single();
  
      if (error) {
        throw error;
      }
  
      // Set the level only if data is available
      setLevel(data?.level + 1 ?? 0); // Default to 0 if level is null or undefined

      let levelText = '';
      switch (data.level + 1) {
        case 1:
          levelText = 'Beginner';
          break;
        case 2:
        case 3:
          levelText = 'Intermediate';
          break;
        case 4:
          levelText = 'Advanced';
          break;
        default:
          levelText = 'Newbie'; // Default to empty if level is not defined
      }
      setUserLevel(levelText);
  
    } catch (error: any) {
      console.log('Error fetching level:', error.message);
    }


  };
  
  const updateLearnTime = async () => {
    try {
      if (user?.id) {
        // Fetch current total learn time
        const { data: profile, error: fetchError } = await supabase
          .from('profiles')
          .select('total_learn_time')
          .eq('id', user.id)
          .single();
  
        if (fetchError) {
          throw fetchError;
        }
  
        const currentTotalLearnTime = profile?.total_learn_time || 0;
        const newTotalLearnTime = currentTotalLearnTime + (timeSpentRef.current / 60); // Convert minutes to hours
        timeSpentRef.current = 0;
  
        // Update the total learn time
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ total_learn_time: newTotalLearnTime })
          .eq('id', user.id);
  
        if (updateError) {
          throw updateError;
        }
  
        // Optionally, fetch updated data to show the new time
        fetchUserData();
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log('Error updating learn time:', error.message);
      } else {
        console.log('An unknown error occurred');
      }
    }
  };
  

  useEffect(() => {
    fetchUserData();
    getLevel();

    // Set up an interval to update the database every minute
    intervalRef.current = setInterval(() => {
      timeSpentRef.current += 1; // Increment the time spent by 1 minute
      updateLearnTime(); // Update the database with the new time
    }, 60000); // 60000 milliseconds = 1 minute

    return () => {
      // Clear the interval when the component unmounts
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [user?.id]);

  // Assume these variables are passed in as props or derived from state
  const numberOfNewAchievement = 2; // Example value, replace with actual state or props
  const actionNeeded = true; // Example value, replace with actual state or props

  const ChangeInformationHandler = () => {
    router.push('/changeInformation');
  };

  const logOutHandler = () => {
    supabase.auth.signOut();
  };

  const avatarCldImage = avatar
    ? cld.image(avatar).resize(thumbnail().width(width).height(width))
    : null;

  const goToComingSoon = () => {
    router.push('/(profile)/ComingSoonScreen');
  };

  return (
    <View style={styles.container}>
      {/* Background Image */}
      <Image 
        style={styles.backgroundImage}
        source={require('@/assets/images/profileScreen/header.png')}
      />

      {/* Content inside Safe Area */}
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.header}>My Profile</Text>

        <View style={{ flexDirection: 'row', marginTop: 40 }}>
          {avatarCldImage ? (
            <AdvancedImage
              cldImg={avatarCldImage}
              style={styles.avatar}
            />
          ) : (
            <Image 
              source={require('@/assets/images/profileScreen/avatar.png')}
              style={styles.avatar}
            />
          )}
          <View style={{ padding: 15.6 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 8 }}>{userName}</Text>
            <Text style={{ fontSize: 16, color: '#898989' }}>{userLevel}</Text>
          </View>
          <TouchableOpacity style={{ alignItems: 'flex-end', flex: 1 }} onPress={ChangeInformationHandler}>
            <Image 
              source={require('@/assets/images/profileScreen/NotePencil.png')}
              style={styles.editImage}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.line} />

        {/* Information Row */}
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoValue}>{totalLearnTime || 'Loading...'}</Text>
            <Text style={styles.infoLabel}>Total Learn</Text>
          </View>
          <View style={styles.verticalLine} />
          <View style={styles.infoItem}>
            <Text style={styles.infoValue}>20</Text>
            <Text style={styles.infoLabel}>Achievements</Text>
          </View>
          <View style={styles.verticalLine} />
          <View style={styles.infoItem}>
            <Text style={styles.infoValue}>{level}</Text>
            <Text style={styles.infoLabel}>Current Level</Text>
          </View>
        </View>

        {/* Dashboard Section */}
        <View style={styles.dashboardContainer}>
          <Text style={styles.dashboardHeader}>Dashboard</Text>

          {/* Dashboard Item - Settings */}
          <TouchableOpacity style={styles.dashboardItem} onPress={goToComingSoon}>
            <View style={styles.iconContainer}>
              <View style={[styles.iconBackground, { backgroundColor: '#4C9AFF' }]}>
                <Image source={require('@/assets/images/profileScreen/setting.png')} style={styles.icon} />
              </View>
              <Text style={styles.itemText}>Settings</Text>
            </View>
            <Image source={require('@/assets/images/profileScreen/arrow.png')} style={styles.arrow} />
          </TouchableOpacity>

          {/* Dashboard Item - Achievements */}
          <TouchableOpacity style={styles.dashboardItem} onPress={goToComingSoon}>
            <View style={styles.iconContainer}>
              <View style={[styles.iconBackground, { backgroundColor: '#FFC107' }]}>
                <Image source={require('@/assets/images/profileScreen/achievement.png')} style={styles.icon} />
              </View>
              <Text style={styles.itemText}>Achievements</Text>
            </View>
            <View style={styles.badgeAndArrowContainer}>
              {numberOfNewAchievement > 0 && (
                <Text style={styles.badgeText}>{numberOfNewAchievement} New</Text>
              )}
              <Image source={require('@/assets/images/profileScreen/arrow.png')} style={styles.arrow} />
            </View>
          </TouchableOpacity>

          {/* Dashboard Item - Privacy */}
          <TouchableOpacity style={styles.dashboardItem} onPress={goToComingSoon}>
            <View style={styles.iconContainer}>
              <View style={[styles.iconBackground, { backgroundColor: '#9E9E9E' }]}>
                <Image source={require('@/assets/images/profileScreen/privacy.png')} style={styles.icon} />
              </View>
              <Text style={styles.itemText}>Privacy</Text>
            </View>
            <View style={styles.badgeAndArrowContainer}>
              {actionNeeded && (
                <Text style={[styles.badgeText, { backgroundColor: '#FF5722' }]}>Action Needed</Text>
              )}
              <Image source={require('@/assets/images/profileScreen/arrow.png')} style={styles.arrow} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={[styles.dashboardContainer, { gap: 10 }]}>
          <Text style={{ fontSize: 12, color: '#898A8D' }}>My Account</Text>
          <TouchableOpacity onPress={logOutHandler}>
            <Text style={{ fontSize: 14, color: '#3E5FAF', marginBottom: 5 }}>Switch to Another Account</Text>
            <Text style={{ fontSize: 14, color: '#FB6D64' }}>Logout Account</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  safeArea: {
    flex: 1,
    margin: 28,
  },
  header: {
    fontSize: 24,
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
  backgroundImage: {
    position: 'absolute',
    width: width,
    height: 250,
    zIndex: -1,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
  },
  editImage: {
    width: 32,
    height: 32,
    marginVertical: 24,
  },
  line: {
    height: 1,
    backgroundColor: '#DADADA',
    width: '100%',
    marginTop: 30,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  infoItem: {
    alignItems: 'center',
  },
  infoValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  infoLabel: {
    fontSize: 14,
    color: '#898989',
    marginTop: 5,
  },
  verticalLine: {
    width: 1,
    height: 40,
    backgroundColor: '#DADADA',
    marginHorizontal: 15,
  },
  dashboardContainer: {
    marginTop: 20,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  dashboardHeader: {
    fontSize: 16,
    color: '#9E9E9E',
    marginBottom: 10,
  },
  dashboardItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBackground: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 40,
    height: 40,
  },
  itemText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  badgeAndArrowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 12,
    color: 'white',
    backgroundColor: '#4C9AFF',
    borderRadius: 12,
    paddingVertical: 2,
    paddingHorizontal: 8,
    marginRight: 5,
  },
  arrow: {
    width: 20,
    height: 20,
  },
});
