import React, { useState, useEffect } from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ImageViewer from 'react-native-image-zoom-viewer';
import ShareModal from '../../views/shareModal/index';

const ImageViewerModalPixxy = ({ viewerContent, updateState, modalVisible, imageIndex }) => {
  const [shareModalVisible, setShareModalVisible] = useState(false)
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}>
         
      <TouchableOpacity
      style={{flexDirection: 'row', justifyContent: 'flex-end', margin: 12}}
        onPress={() => {
          updateState({ modalVisible: !modalVisible });
        }}>
        <AntDesign name="close" color="#182A53" size={18} />
      </TouchableOpacity>
      <ImageViewer index={imageIndex} onRequestClose={() => alert('')} imageUrls={viewerContent} />
    </Modal>
  );
};

export default ImageViewerModalPixxy;
