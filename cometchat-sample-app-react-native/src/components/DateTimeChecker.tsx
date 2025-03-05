import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';

const DateTimeChecker = () => {
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  const isLeapYear = (year: number) => {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  };

  const getDaysInMonth = (month: number, year: number) => {
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (month === 2 && isLeapYear(year)) {
      return 29;
    }
    return daysInMonth[month - 1];
  };

  const checkDate = () => {
    const dayNum = parseInt(day);
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);

    if (isNaN(dayNum) || isNaN(monthNum) || isNaN(yearNum)) {
      Alert.alert('Lỗi', 'Vui lòng nhập số hợp lệ');
      return;
    }

    if (yearNum < 1 || yearNum > 9999) {
      Alert.alert('Lỗi', 'Năm phải từ 1 đến 9999');
      return;
    }

    if (monthNum < 1 || monthNum > 12) {
      Alert.alert('Lỗi', 'Tháng phải từ 1 đến 12');
      return;
    }

    const maxDays = getDaysInMonth(monthNum, yearNum);
    if (dayNum < 1 || dayNum > maxDays) {
      Alert.alert('Lỗi', `Ngày phải từ 1 đến ${maxDays} trong tháng ${monthNum}`);
      return;
    }

    const leapYearMessage = isLeapYear(yearNum) ? 'Đây là năm nhuận' : 'Đây không phải là năm nhuận';
    Alert.alert(
      'Kết quả kiểm tra',
      `Ngày ${dayNum}/${monthNum}/${yearNum} là ngày hợp lệ.\n${leapYearMessage}`
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kiểm Tra Ngày Tháng Năm</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ngày"
          keyboardType="numeric"
          value={day}
          onChangeText={setDay}
          maxLength={2}
        />
        <TextInput
          style={styles.input}
          placeholder="Tháng"
          keyboardType="numeric"
          value={month}
          onChangeText={setMonth}
          maxLength={2}
        />
        <TextInput
          style={styles.input}
          placeholder="Năm"
          keyboardType="numeric"
          value={year}
          onChangeText={setYear}
          maxLength={4}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={checkDate}>
        <Text style={styles.buttonText}>Kiểm tra</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  input: {
    width: '30%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DateTimeChecker; 