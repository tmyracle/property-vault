import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { type Address } from "~/server/db/schema";

// Create styles
const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    padding: 8,
  },
  title: {
    fontSize: "18px",
    fontWeight: "bold",
  },
  section: {
    padding: 10,
    fontSize: "14px",
    lineHeight: "1.4",
  },
});

type DisbursementRequestReportProps = {
  name: string;
  address: Address;
  amount: string;
  case_number: string;
  date: string;
  supervisor: string;
  department_name: string;
};

const DisbursementRequestReport = ({
  name,
  address,
  amount,
  case_number,
  date,
  supervisor,
  department_name,
}: DisbursementRequestReportProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>
          {department_name} Property Room Cash Account
        </Text>
      </View>
      <View style={styles.section}>
        <Text>To: Finance</Text>
        <Text>RE: Return of Property/Evidence</Text>
      </View>
      <View style={styles.section}>
        <Text>Please issue a check to:</Text>
        <Text>{name}</Text>
        <Text>
          {address.street} {address.unit ? address.unit : ""}
        </Text>
        <Text>
          {address.city}, {address.state} {address.zip}
        </Text>
      </View>
      <View style={styles.section}>
        <Text>For the amount of:</Text>
        <Text>
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(Number(amount))}
        </Text>
      </View>
      <View style={styles.section}>
        <Text>Case number and date taken into property:</Text>
        <Text>Case number: {case_number}</Text>
        <Text>Date: {date}</Text>
      </View>
      <View style={styles.section}>
        <Text>Authorized by:</Text>
        <Text>{supervisor}</Text>
      </View>
    </Page>
  </Document>
);

export default DisbursementRequestReport;
