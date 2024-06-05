import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation } from 'expo-router';
import { AuthContext } from '../app/AuthContext';
import CustomDropdown from '../Components/CustomDropdown';
import { useToast } from '../app/ToastContext';

const AdminSignup = ({ setCurrentScreen }) => {
  const { AdminOtp } = useContext(AuthContext);
  const [payload, setPayload] = useState({
    firmName: '',
    specialization: '',
    mobileNumber: '',
    alternateMobileNumber: '',
    email: '',
    password: '',
    Cpassword: '',
    role: 'ROLE_ADMIN',
  });

  const RolesData = [
    { label: 'Birthday Booking (Birthday Hall)', value: 'Birthday Booking (Birthday Hall)' },
    { label: 'Marriage Ceremony Booking (Banquets)', value: 'Marriage Ceremony Booking (Banquets)' },
    { label: 'Get Together / Party Booking (Party Hall)', value: 'Get Together / Party Booking (Party Hall)' },
    { label: 'Occasion Organizers (Event Management Team)', value: 'Occasion Organizers (Event Management Team)' },
    { label: "Disc Jockey (DJ's)", value: "Disc Jockey (DJ's)" },
    { label: 'Performers', value: 'Performers' },
    { label: 'Decorators', value: 'Decorators' },
    { label: 'Hosts', value: 'Hosts' },
  ];

  const navigation = useNavigation();
  const { showSuccess, showError, showWarn } = useToast();

  const handlePress = () => {
    setCurrentScreen(true);
  };

  const [error, setError] = useState({
    nameError: '',
    mailError: '',
    phoneNoErr: '',
    altPhoneNoErr: '',
    specializationError: '',
    passwordErr: '',
    CpasswordErr: '',
  });
  const [isPressed, setIsPressed] = useState(false);

  const selectSpecialization = (item) => {
    setPayload({ ...payload, specialization: item.value });
    setError({ ...error, specializationError: '' });
  };

  const handleSubmit = async () => {
    if (validate()) {
      try {
        const ack = await AdminOtp(payload);
        if (ack.status === 200) {
          console.log('Otp sent successfully');
          navigation.navigate('Otp'); // Ensure this matches the route name in Stack
        }
        if (ack.status === 409) {
          showWarn('User already exists');
        }
      } catch (err) {
        console.error('Error sending OTP:', err);
        showError('Error sending OTP');
      }
      console.log(payload); // Placeholder for form submission
    }
  };

  const validate = () => {
    let valid = true;

    const errors = {
      nameError: '',
      mailError: '',
      phoneNoErr: '',
      altPhoneNoErr: '',
      specializationError: '',
      passwordErr: '',
      CpasswordErr: '',
    };

    if (payload.firmName.trim() === '') {
      errors.nameError = 'Business name is required';
      valid = false;
    }

    if (payload.specialization.trim() === '') {
      errors.specializationError = 'Specialization is required';
      valid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(payload.email)) {
      errors.mailError = 'Invalid email format';
      valid = false;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(payload.mobileNumber)) {
      errors.phoneNoErr = 'Phone number must be 10 digits';
      valid = false;
    }

    if (payload.alternateMobileNumber && !phoneRegex.test(payload.alternateMobileNumber)) {
      errors.altPhoneNoErr = 'Alternate phone number must be 10 digits';
      valid = false;
    }

    if (payload.password.length < 6) {
      errors.passwordErr = 'Password must be at least 8 characters';
      valid = false;
    }

    if (payload.password !== payload.Cpassword) {
      errors.CpasswordErr = "Passwords don't match";
      valid = false;
    }

    setError(errors);
    return valid;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0} // adjust this value based on your needs
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps='handled'
      >
        <View style={styles.loginBox}>
          <View style={styles.box}>
            <TextInput
              placeholder="Enter Business name"
              keyboardType="default"
              style={styles.input}
              onChangeText={(text) => setPayload({ ...payload, firmName: text })}
            />
            {error.nameError ? <Text style={styles.errText}>{error.nameError}</Text> : null}
          </View>

          <View style={styles.box}>
            <CustomDropdown heading="Select Specialization" Data={RolesData} handleSelect={selectSpecialization} />
            {error.specializationError ? <Text style={styles.errText}>{error.specializationError}</Text> : null}
          </View>

          <View style={styles.box}>
            <TextInput
              placeholder="Email"
              keyboardType="email-address"
              style={styles.input}
              onChangeText={(text) => setPayload({ ...payload, email: text })}
            />
            {error.mailError ? <Text style={styles.errText}>{error.mailError}</Text> : null}
          </View>

          <View style={styles.box}>
            <TextInput
              placeholder="Phone Number"
              keyboardType="phone-pad"
              style={styles.input}
              onChangeText={(text) => setPayload({ ...payload, mobileNumber: text })}
            />
            {error.phoneNoErr ? <Text style={styles.errText}>{error.phoneNoErr}</Text> : null}
          </View>

          <View style={styles.box}>
            <TextInput
              placeholder="Alternate Phone Number"
              keyboardType="phone-pad"
              style={styles.input}
              onChangeText={(text) => setPayload({ ...payload, alternateMobileNumber: text })}
            />
            {error.altPhoneNoErr ? <Text style={styles.errText}>{error.altPhoneNoErr}</Text> : null}
          </View>

          <View style={styles.box}>
            <TextInput
              placeholder="Password"
              secureTextEntry={true}
              style={styles.input}
              onChangeText={(text) => setPayload({ ...payload, password: text })}
            />
            {error.passwordErr ? <Text style={styles.errText}>{error.passwordErr}</Text> : null}
          </View>

          <View style={styles.box}>
            <TextInput
              placeholder="Confirm Password"
              secureTextEntry={true}
              style={styles.input}
              onChangeText={(text) => setPayload({ ...payload, Cpassword: text })}
            />
            {error.CpasswordErr ? <Text style={styles.errText}>{error.CpasswordErr}</Text> : null}
          </View>

          <View style={styles.loginBottom}>
            <Text style={styles.text}>
              Already Have an Account?{' '}
              <Text style={styles.linkText1} onPress={handlePress}>
                Login Here
              </Text>
            </Text>
            <Pressable
              style={[styles.btn, isPressed && styles.btnPressed]}
              onPressIn={() => setIsPressed(true)}
              onPressOut={() => setIsPressed(false)}
              onPress={handleSubmit}
            >
              <Text style={styles.btn_text}>Submit</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  loginBox: {
    width: '100%',
    paddingHorizontal: 20,
    gap: 20,
  },
  input: {
    width: '100%',
    height: 60,
    borderWidth: 1,
    borderColor: '#007BFF',
    borderRadius: 6,
    paddingHorizontal: 20,
  },
  loginBottom: {
    gap: 25,
    width: '100%',
    alignItems: 'center',
  },
  text: {
    fontSize: 15,
    fontFamily: 'Monster',
  },
  btn: {
    backgroundColor: '#007BFF',
    borderRadius: 8,
    width: 200,
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
  },
  btnPressed: {
    backgroundColor: '#0056b3', // Darker blue color
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  btn_text: {
    color: 'white',
  },
  box: {
    alignItems: 'flex-start',
    gap: 2,
  },
  errText: {
    color: 'red',
    paddingLeft: 15,
    letterSpacing: 1,
  },
  linkText1: {
    fontSize: 16,
    color: '#007BFF',
    fontWeight: '600',
  },
});

export default AdminSignup;
