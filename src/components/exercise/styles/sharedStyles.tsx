import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const correctColor = '#99CC29'; // Màu xanh lá
export const incorrectColor = '#FF2442'; // Màu đỏ
export const incorrectAnswerColor = '#EB5757'; // Màu đỏ

export const sharedStyles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    padding: width * 0.05,
    alignItems: 'center',
  },
  question: {
    //marginTop: width * 0.01,
    marginHorizontal: width*0.03,
    fontWeight: '500',
    fontSize: width * 0.063,
    textAlign: 'center',
    marginBottom: height * 0.045,
  },
  smallQuestionText: {
    fontSize: 20,  // Bạn có thể điều chỉnh kích thước phù hợp
    marginHorizontal: width*0.03,
    marginBottom: 0.065*height,
    fontWeight: '600',
  },
  input: {
    height: height * 0.37,
    borderColor: '#C5BFBF',
    borderWidth: 1,
    width: width * 0.8,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: width * 0.048,
    fontSize: width * 0.045,
  },
  checkAnswerButton: {
    width: '95%',
    height: width*0.128,
    backgroundColor: '#0693F1',
    borderRadius: width*0.1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: height*0.03,
  },
  textCheckAnswerButton: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },

  //multiple choice box answer
  MCBoxAnswer: {
    width: width*0.821,
    height: height*0.065,
    backgroundColor: '#3DB2FF',
    borderRadius: width*0.027,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: width*0.04,
    // Thuộc tính đổ bóng cho iOS
    shadowColor: '#000', // Màu đổ bóng đen
    shadowOffset: {
      width: 2.5, // Độ lệch ngang
      height: 5, // Độ lệch dọc
    },
    shadowOpacity: 0.2, // Độ mờ đổ bóng (20%)
    shadowRadius: 1,

    // Thuộc tính đổ bóng cho Android
    elevation: 5,
  },

  BoxOfMCBoxSmall: {
    paddingHorizontal: width*0.042,
  },
  MCBoxAnswerSmall: {
    width: 0.34*width,
    height: height*0.065,
    backgroundColor: '#3DB2FF',
    borderRadius: width*0.027,
    alignItems: 'center',
    justifyContent: 'center',
    // Thuộc tính đổ bóng cho iOS
    shadowColor: '#000', // Màu đổ bóng đen
    shadowOffset: {
      width: 2.5, // Độ lệch ngang
      height: 5, // Độ lệch dọc
    },
    shadowOpacity: 0.2, // Độ mờ đổ bóng (20%)
    shadowRadius: 1,
    elevation: 5,
    marginBottom: height*0.037,
  },

  //Matching pairs
  TwoFlatListBox:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: '67%',
    borderWidth: 2,
    paddingTop: height*0.03,
    paddingBottom: height*0.022,
    borderRadius: width*0.067,
    borderColor: '#CDCDCD'
  },

  // Result Box
  resultBox: {
    padding: width*0.0267,
    width: '100%',
    //height: height*0.278,
    height: 'auto',
    paddingBottom: height*0.09,
    borderRadius: width* 0.03,
    position: 'absolute',
    bottom: height*0.015,
  },

  answerBox: {
    
  },

  resultTitle:{
    fontSize: 22,
    fontWeight: 'bold',
    paddingVertical: width*0.0213,
  },
  answerText: {
    fontSize: 20,
    padding: width*0.008,
    fontWeight: 'bold',
  },
  imageQuestion: {
    width: width*0.5,
    height: height*0.22,
    resizeMode: "contain",
    marginBottom: width*0.144,
  },
});
