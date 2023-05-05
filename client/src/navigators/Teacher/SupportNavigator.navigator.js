


function SupportNaviagtor() {

  return (

    <Stack.Navigator>

      <Stack.Screen name="Support" component={SupportScreen} />

      <Stack.Screen name="SupportDetail" component={SupportDetailScreen} />

    </Stack.Navigator>

  );

}

export default SupportNaviagtor;