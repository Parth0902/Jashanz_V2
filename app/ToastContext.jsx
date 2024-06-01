import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({ message: '', type: '', visible: false });
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (toast.visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }).start(() => {
            setToast({ ...toast, visible: false });
          });
        }, 1000);
      });
    }
  }, [toast]);

  const showSuccess = (message) => setToast({ message, type: 'success', visible: true });
  const showError = (message) => setToast({ message, type: 'error', visible: true });
  const showWarn = (message) => setToast({ message, type: 'warn', visible: true });

  const renderToastIcon = () => {
    switch (toast.type) {
      case 'success':
        return <Ionicons name="checkmark-circle" size={24} color="white" />;
      case 'warn':
        return <Ionicons name="warning" size={24} color="white" />;
      case 'error':
        return <Ionicons name="close-circle" size={24} color="white" />;
      default:
        return null;
    }
  };

  return (
    <ToastContext.Provider value={{ showSuccess, showError, showWarn }}>
      {children}
      {toast.visible && (
        <Animated.View style={[styles.toast, { opacity: fadeAnim, backgroundColor: toast.type === 'success' ? '#4CAF50' : toast.type === 'warn' ? '#FFC107' : '#F44336' }]}>
          <View style={styles.iconContainer}>{renderToastIcon()}</View>
          <Text style={styles.message}>{toast.message}</Text>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);

const styles = StyleSheet.create({
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 50,
    left: '10%',
    right: '10%',
    padding: 15,
    borderRadius: 10,
  },
  iconContainer: {
    marginRight: 10,
  },
  message: {
    color: 'white',
    fontSize: 16,
  },
});




