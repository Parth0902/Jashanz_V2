import React, { useRef, useState } from 'react';
import { View, Image, ScrollView, StyleSheet, Dimensions } from 'react-native';
const { width } = Dimensions.get('window');


const ImageCarousel = ({images}) => {
  const scrollViewRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const activeIndex = Math.round(scrollPosition / width);
    setActiveIndex(activeIndex);
  };

  const handleScrollToIndex = (index) => {
    scrollViewRef.current.scrollTo({ x: index * width, animated: true });
    setActiveIndex(index);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {images.map((image, index) => (
          <Image key={index} source={{ uri:image?.imgUrl }} style={styles.image} />
        ))}
      </ScrollView>
      <View style={styles.indicatorContainer}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              { opacity: index === activeIndex ? 1 : 0.5 },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  image: {
    width:width*0.9,
    height: 220,
    resizeMode: 'cover',
    borderRadius: 12,
  },
  indicatorContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
  },
  indicator: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    margin: 5,
  },
});

export default ImageCarousel;
