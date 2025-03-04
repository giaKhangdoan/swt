import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export const DateChecker = () => {
  const [date1, setDate1] = useState(new Date());
  const [date2, setDate2] = useState(new Date());
  const [showPicker1, setShowPicker1] = useState(false);
  const [showPicker2, setShowPicker2] = useState(false);

  // Kiểm tra năm nhuận
  const isLeapYear = (year: number) => {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  };

  // Kiểm tra ngày hợp lệ
  const isValidDate = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    // Kiểm tra năm
    if (year < 1 || year > 9999) return false;

    // Kiểm tra tháng
    if (month < 1 || month > 12) return false;

    // Số ngày trong tháng
    const daysInMonth = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    // Kiểm tra ngày
    if (day < 1 || day > daysInMonth[month - 1]) return false;

    return true;
  };

  const onChange1 = (event, selectedDate) => {
    const currentDate = selectedDate || date1;
    setShowPicker1(Platform.OS === 'ios');
    if (isValidDate(currentDate)) {
      setDate1(currentDate);
    } else {
      Alert.alert('Lỗi', 'Ngày không hợp lệ!');
    }
  };

  const onChange2 = (event, selectedDate) => {
    const currentDate = selectedDate || date2;
    setShowPicker2(Platform.OS === 'ios');
    if (isValidDate(currentDate)) {
      setDate2(currentDate);
    } else {
      Alert.alert('Lỗi', 'Ngày không hợp lệ!');
    }
  };

  const formatDate = (date) => {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const getDaysDifference = () => {
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getWeekday = (date) => {
    const weekdays = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    return weekdays[date.getDay()];
  };

  // Thông tin chi tiết về ngày
  const getDateInfo = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    return {
      isLeapYear: isLeapYear(year) ? 'Năm nhuận' : 'Không phải năm nhuận',
      daysInMonth: new Date(year, month, 0).getDate(),
      dayOfYear: Math.floor((date - new Date(year, 0, 0)) / (1000 * 60 * 60 * 24)),
      weekNumber: Math.ceil((((date - new Date(date.getFullYear(), 0, 1)) / 86400000) + 1) / 7)
    };
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Kiểm tra ngày tháng
        </Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.dateSection}>
          <Text style={styles.sectionTitle}>
            Ngày thứ nhất:
          </Text>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => setShowPicker1(true)}
          >
            <Text style={styles.buttonText}>Chọn ngày</Text>
          </TouchableOpacity>
          <View style={styles.resultContainer}>
            <Text testID="date-1-info" style={styles.label}>
              Ngày: {formatDate(date1)}
            </Text>
            <Text style={styles.label}>Thứ: {getWeekday(date1)}</Text>
            <Text style={styles.label}>{getDateInfo(date1).isLeapYear}</Text>
            <Text style={styles.label}>Số ngày trong tháng: {getDateInfo(date1).daysInMonth}</Text>
            <Text style={styles.label}>Ngày thứ {getDateInfo(date1).dayOfYear} trong năm</Text>
            <Text style={styles.label}>Tuần thứ {getDateInfo(date1).weekNumber} trong năm</Text>
          </View>
        </View>

        <View style={styles.dateSection}>
          <Text style={styles.sectionTitle}>Ngày thứ hai:</Text>
          <TouchableOpacity 
            testID="button_date_2"
            style={styles.button}
            onPress={() => setShowPicker2(true)}
          >
            <Text style={styles.buttonText}>Chọn ngày</Text>
          </TouchableOpacity>
          <View style={styles.resultContainer}>
            <Text style={styles.label}>Ngày: {formatDate(date2)}</Text>
            <Text style={styles.label}>Thứ: {getWeekday(date2)}</Text>
            <Text style={styles.label}>{getDateInfo(date2).isLeapYear}</Text>
            <Text style={styles.label}>Số ngày trong tháng: {getDateInfo(date2).daysInMonth}</Text>
            <Text style={styles.label}>Ngày thứ {getDateInfo(date2).dayOfYear} trong năm</Text>
            <Text style={styles.label}>Tuần thứ {getDateInfo(date2).weekNumber} trong năm</Text>
          </View>
        </View>

        <View style={styles.comparisonSection}>
          <Text testID="comparison-title" style={styles.sectionTitle}>
            So sánh:
          </Text>
          <View style={styles.resultContainer}>
            <Text style={styles.label}>Khoảng cách: {getDaysDifference()} ngày</Text>
            <Text style={styles.label}>
              {date1 > date2 
                ? 'Ngày thứ nhất sau ngày thứ hai'
                : date1 < date2
                  ? 'Ngày thứ nhất trước ngày thứ hai'
                  : 'Hai ngày giống nhau'}
            </Text>
          </View>
        </View>

        {showPicker1 && (
          <DateTimePicker
            value={date1}
            mode="date"
            display="default"
            onChange={onChange1}
          />
        )}

        {showPicker2 && (
          <DateTimePicker
            value={date2}
            mode="date"
            display="default"
            onChange={onChange2}
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    backgroundColor: '#007AFF',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    padding: 16,
  },
  dateSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultContainer: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  comparisonSection: {
    marginTop: 10,
  },
});