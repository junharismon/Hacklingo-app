import { StyleSheet, View, Image, useWindowDimensions, TouchableOpacity } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  useAnimatedRef,
} from 'react-native-reanimated';
import Pagination from './pagination';
const CustomImageCarousal = ({ data, autoPlay, pagination, navigateToGroups }) => {
  const scrollViewRef = useAnimatedRef(null);
  const interval = useRef();
  const [isAutoPlay, setIsAutoPlay] = useState(autoPlay);
  const [newData] = useState([
    { key: 'spacer-left' },
    ...data,
    { key: 'spacer-right' },
  ]);
  const { width } = useWindowDimensions();
  const SIZE = width * 0.7;
  const SPACER = (width - SIZE) / 2;
  const x = useSharedValue(0);
  const offSet = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler({
    onScroll: event => {
      x.value = event.contentOffset.x;
    },
  });
  const getStyleForIndex = (index) => {
    const style = useAnimatedStyle(() => {
      const scale = interpolate(
        x.value,
        [(index - 2) * SIZE, (index - 1) * SIZE, index * SIZE],
        [0.88, 1, 0.88]
      );
      return {
        transform: [{ scale }],
      };
    });

    return style;
  };

  useEffect(() => {
    if (isAutoPlay === true) {
      let _offSet = offSet.value;
      interval.current = setInterval(() => {
        if (_offSet >= Math.floor(SIZE * (data.length - 1) - 10)) {
          _offSet = 0;
        } else {
          _offSet = Math.floor(_offSet + SIZE);
        }
        scrollViewRef.current.scrollTo({ x: _offSet, y: 0 });
      }, 1000);
    } else {
      clearInterval(interval.current);
    }
  }, [SIZE, SPACER, isAutoPlay, data.length, offSet.value, scrollViewRef]);

  return (
    <View>
      <Animated.ScrollView
        ref={scrollViewRef}
        onScroll={onScroll}
        onScrollBeginDrag={() => {
          setIsAutoPlay(false);
        }}
        onMomentumScrollEnd={e => {
          offSet.value = e.nativeEvent.contentOffset.x;
          setIsAutoPlay(autoPlay);
        }}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={SIZE}
        horizontal
        bounces={false}
        showsHorizontalScrollIndicator={false}>
        {newData.map((item, index) => {
          // Call the function here instead
          const style = getStyleForIndex(index);
          if (!item.image) {
            return <View style={{ width: SPACER }} key={index} />;
          }
          return (
            <TouchableOpacity onPress={() => {
              navigateToGroups(item.language)
              }} key={item.language}>
              <View style={{ width: SIZE }} key={index}>
                <Animated.View style={[styles.imageContainer, style]}>
                  <Image source={item.image} style={styles.image} />
                </Animated.View>
              </View>
            </TouchableOpacity>
          );
        })}
      </Animated.ScrollView>
      {pagination && <Pagination data={data} x={x} size={SIZE} />}
    </View >
  );
};

export default CustomImageCarousal;

const styles = StyleSheet.create({
  imageContainer: {
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: 'pink',
  },
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 16 / 9,
  },
});