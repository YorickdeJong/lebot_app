import React, {useContext} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ColorsBlue } from '../../constants/palet';
import Icon from '../../components/Icon';
import { AuthContext } from '../../store/auth-context';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

const CustomHeader = ({ title }) => {
const authCtx = useContext(AuthContext);
  return (
    <View
      style={{
        shadowColor: ColorsBlue.blue1400,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.9,
        shadowRadius: 4,
        elevation: 2,

      }}
    >
      <LinearGradient
        colors={[ColorsBlue.blue1400, ColorsBlue.blue1400]}
        style={styles.header}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
      >
            <View style={{ marginLeft: 10, marginTop: verticalScale(27)
                }}>
                <Icon
                    icon="menu"
                    size={30}
                    color={ColorsBlue.blue100}
                    onPress={() => console.log(`pressed`)}
                />
            </View>
            <View style={{ marginLeft: 10, marginTop: verticalScale(27)
                }}>
                <Icon
                    icon="robot"
                    differentDir={true}
                    size={24}
                    addStyle={{opacity: 0.2}}
                    color={ColorsBlue.blue100}
                    onPress={() => console.log(`pressed`)}
                />
            </View>

            <View style={{ right: 15, top: verticalScale(32), position: 'absolute'
                }}>
                <Icon
                    icon="rocket"
                    differentDir={true}
                    size={24}
                    addStyle={{opacity: 0.8}}
                    color={ColorsBlue.blue100}
                    onPress={() => authCtx.authenticate('token')}
                />
            </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: verticalScale(58),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 20,
    color: 'white',
  },
});

export default CustomHeader;
