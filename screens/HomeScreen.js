import React, { useEffect, useLayoutEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text, Avatar, ListItem } from 'react-native-elements';
import { auth, db } from '../services/firebase';
import { StatusBar } from 'expo-status-bar';
import {
  AntDesign,
  Feather,
  FontAwesome5,
  MaterialIcons,
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import CustomListItem from '../components/CustomListItem';
import Navigation from '../components/Navigation';

const HomeScreen = ({ navigation }) => {
  const signOutUser = () => {
    auth
      .signOut()
      .then(() => navigation.replace('Login'))
      .catch((error) => alert(error.message));
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Expense Tracker',
      headerRight: () => (
        <View style={{ marginRight: 20 }}>
          <TouchableOpacity activeOpacity={0.5} onPress={signOutUser}>
            <Text style={{ fontWeight: 'bold' }}>Logout</Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  // transactions
  const [transactions, setTransactions] = useState([]);
  useEffect(() => {
    const unsubscribe = db
      .collection('expense')
      .orderBy('timestamp', 'desc')
      .onSnapshot(
        (snapshot) =>
          setTransactions(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          ) &
          setTotalIncome(
            snapshot.docs.map((doc) =>
              doc.data()?.email === auth.currentUser.email &&
              doc.data()?.type == 'income'
                ? doc.data().price
                : 0
            )
          ) &
          setTotalExpense(
            snapshot.docs.map((doc) =>
              doc.data()?.email === auth.currentUser.email &&
              doc.data()?.type == 'expense'
                ? doc.data().price
                : 0
            )
          )
      );

    return unsubscribe;
  }, []);

  // stufff
  const [totalIncome, setTotalIncome] = useState([]);
  const [income, setIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState([]);
  const [expense, setExpense] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);
  useEffect(() => {
    if (totalIncome) {
      if (totalIncome?.length == 0) {
        setIncome(0);
      } else {
        setIncome(totalIncome?.reduce((a, b) => Number(a) + Number(b), 0));
      }
    }
    if (totalExpense) {
      if (totalExpense?.length == 0) {
        setExpense(0);
      } else {
        setExpense(totalExpense?.reduce((a, b) => Number(a) + Number(b), 0));
      }
    }
  }, [totalIncome, totalExpense, income, expense]);

  useEffect(() => {
    if (income || expense) {
      setTotalBalance(income - expense);
    } else {
      setTotalBalance(0);
    }
  }, [totalIncome, totalExpense, income, expense]);

  const [filter, setFilter] = useState([]);
  useEffect(() => {
    if (transactions) {
      setFilter(
        transactions.filter(
          (transaction) => transaction.data.email === auth.currentUser.email
        )
      );
    }
  }, [transactions]);

  return (
    <>
      <View style={styles.container}>
        
        <View style={styles.card}>
          <View style={styles.cardTop}>
            <Text style={{ textAlign: 'center', color: 'aliceblue' }}>
              Total Balance
            </Text>
            <Text h3 style={{ textAlign: 'center', color: 'aliceblue' }}>
              Rs. {totalBalance.toFixed(2)}
            </Text>
          </View>
          <View style={styles.cardBottom}>
            <View>
              <View style={styles.cardBottomSame}>
                <Feather name="arrow-down" size={18} color="green" />
                <Text
                  style={{
                    textAlign: 'center',
                    marginLeft: 5,
                  }}>
                  Income
                </Text>
              </View>
              <Text h4 style={{ textAlign: 'center' }}>
                {`Rs. ${income?.toFixed(2)}`}
              </Text>
            </View>
          </View>
          <View style={styles.cardBottom}>
            <View>
              <View style={styles.cardBottomSame}>
                <Feather name="arrow-up" size={18} color="red" />
                <Text style={{ textAlign: 'center', marginLeft: 5 }}>
                  Expense
                </Text>
              </View>
              <Text h4 style={{ textAlign: 'center' }}>
                {`Rs. ${expense?.toFixed(2)}`}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.recentTitle}>
          <Text h4 style={{ color: 'black' }}>
            Recent Transactions
          </Text>
        </View>
        {filter?.length > 0 ? (
          <View style={styles.recentTransactions}>
            {filter?.slice(0, 3).map((info) => (
              <View key={info.id}>
                <CustomListItem
                  info={info.data}
                  navigation={navigation}
                  id={info.id}
                />
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.containerNull}>
            <FontAwesome5 name="list-alt" size={24} color="#EF8A76" />
            <Text h4 style={{ color: '#4A2D5D' }}>
              No Transactions
            </Text>
          </View>
        )}
      </View>

      <View style={styles.addButton}>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => navigation.navigate('Home')}>
          <FontAwesome5 name="home" size={24} color="#00509d" />
          <Text style={{ color: 'grey', fontSize: 8 }}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Limit')}
          activeOpacity={0.5}>
          <MaterialCommunityIcons
            name="clipboard-flow-outline"
            size={24}
            color="#00509d"
          />
          <Text style={{ color: 'grey', fontSize: 8 }}> Limit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Add')}
          activeOpacity={0.5}>
          <MaterialIcons name="add-circle" size={55} color="#3bdefb" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Off')}
          activeOpacity={0.5}>
          <Ionicons name="cash-outline" size={24} color="#00509d" />
          <Text style={{ color: 'grey', fontSize: 8 }}> List</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => navigation.navigate('Seemore')}>
          <MaterialIcons name="read-more" size={26} color="#00509d" />
          <Text style={{ color: '#00509d', fontSize: 8 }}>More</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: 10,
  },
  fullName: {
    flexDirection: 'row',
  },
  card: {
    backgroundColor: '#3490dc',
    alignItems: 'center',
    width: '100%',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    marginVertical: 20,
  },
  cardTop: {
    // backgroundColor: 'blue',
    marginBottom: 20,
  },
  cardBottom: {
    flexDirection: 'column',
    justifyContent: 'center',
    width: '50%',
    margin: 'auto',
    marginBottom: 20,
    backgroundColor: '#bbdefb',
    borderRadius: 5,
  },
  cardBottomSame: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  recentTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  recentTransactions: {
    backgroundColor: 'white',
    width: '100%',
  },
  seeAll: {
    fontWeight: 'bold',
    color: 'green',
    fontSize: 16,
  },
  addButton: {
    position: 'absolute',
    bottom: 0,
    padding: 10,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,

    elevation: 24,
  },
  plusButton: {
    backgroundColor: '#bbdefb',
    padding: 10,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
  },
  containerNull: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    width: '100%',
  },
});
