import React from 'react';
import { Modal, View, Text, FlatList, TouchableOpacity, StyleSheet, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { sharedStyles } from '../styles/sharedStyles';

const { width, height } = Dimensions.get('window');

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  leftColumn: { word: string, index: number }[];
  rightColumn: { word: string, index: number }[];
  colors: string[];
}

const AnswerModal: React.FC<ModalProps> = ({ visible, onClose, leftColumn, rightColumn, colors }) => {
  // Sắp xếp rightColumn theo thứ tự của leftColumn dựa trên `index`
  const sortedRightColumn = leftColumn.map(leftItem =>
    rightColumn.find(rightItem => rightItem.index === leftItem.index)
  ).filter(item => item !== undefined); // Loại bỏ các mục `undefined`

  const renderItem = (isRight: 0 | 1) => ({ item, index }: { item: { word: string, index: number }, index: number }) => {
    const backgroundColor = colors[index];
    return (
      <View style={[sharedStyles.MCBoxAnswerSmall, { backgroundColor }]}>
        <Text style={[sharedStyles.textCheckAnswerButton, { color: '#444444' }]}>{item.word}</Text>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalContainer}>
        {/* Nền modal: Nhấn ở đây sẽ đóng modal */}
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backgroundOverlay} />
        </TouchableWithoutFeedback>

        {/* Nội dung modal: Không chặn sự kiện cuộn */}
        <View style={styles.modalContent}>
          <Text style={styles.title}>CORRECT ANSWERS</Text>

          <View style={styles.listsContainer}>
            <FlatList
              data={leftColumn}
              renderItem={renderItem(0)}
              keyExtractor={(item) => item.index.toString()}
              contentContainerStyle={{ alignItems: 'center' }}
              style={{ flex: 1 }}
              showsVerticalScrollIndicator={false}
            />
            <FlatList
              data={sortedRightColumn}
              renderItem={renderItem(1)}
              keyExtractor={(item) => item?.index.toString()}
              contentContainerStyle={{ alignItems: 'center' }}
              style={{ flex: 1 }}
              showsVerticalScrollIndicator={false}
            />
          </View>

          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: width * 0.053,
    borderTopLeftRadius: width * 0.0533,
    borderTopRightRadius: width * 0.0533,
    height: '88%',
    zIndex: 10,  // Đảm bảo modal ở trên nền
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: '#222222',
    marginTop: height * 0.015,
    marginBottom: height * 0.037,
    textAlign: 'center',
  },
  listsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: '70%',
  },
  closeButton: {
    height: width * 0.13,
    marginTop: height * 0.025,
    backgroundColor: '#a0c0ff',
    borderRadius: width * 0.05,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
});

export default AnswerModal;
