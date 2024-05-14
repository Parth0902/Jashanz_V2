import React, { useCallback } from "react";
import { View, StyleSheet, Text, Button } from "react-native";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import FilterComponent from "./FilterComponent";
const Sheet = ({ snapPoints, bottomSheetRef, Component, filterOpt, sheetIndex,setEvents,events }) => {
  return (
    <BottomSheet
      index={sheetIndex}
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      
    >
      <FilterComponent filterOpt={filterOpt} setEvents={setEvents} events={events} />
    </BottomSheet>
  );
};

export default Sheet;
