import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface TermsOfUseScreenProps {
  onBack: () => void;
}

export default function TermsOfUseScreen({
  onBack,
}: TermsOfUseScreenProps) {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>TH HUNTER</Text>
            <Text style={styles.title}>TERMS OF USE</Text>
          </View>

          <Pressable
            style={styles.closeButton}
            onPress={onBack}
            hitSlop={10}
          >
            <Ionicons name="close" size={28} color="#FFFFFF" />
          </Pressable>
        </View>

        <Text style={styles.updated}>
          Last updated: September 2, 2026
        </Text>

        <Text style={styles.body}>
          These Terms of Use ("Terms") govern your use of the TH Hunter
          mobile application ("App"). By downloading, accessing, or using
          the App, you agree to these Terms.
        </Text>

        <Text style={styles.body}>
          If you do not agree with these Terms, please do not use the App.
        </Text>

        <Section title="About TH-Hunter">
          TH-Hunter is a collector-focused application designed to help
          users browse, track, and manage information about Hot Wheels
          Treasure Hunt (TH) and Super Treasure Hunt (STH) vehicles. The App
          is provided for informational and personal collection-tracking
          purposes.
        </Section>

        <Section title="Use of the App">
          You may use TH-Hunter for your personal, non-commercial purposes,
          including browsing TH and STH vehicle information, tracking vehicles
          in your collection, monitoring collection progress, searching and
          filtering vehicle information, and using other features provided by
          the App.
        </Section>

        <Section title="Acceptable Use">
          You agree not to use the App for unlawful purposes, attempt to
          interfere with or disrupt the App, attempt to gain unauthorized
          access to the App or its systems, copy or modify the App except
          where permitted by applicable law, or use automated systems to
          access or collect data from the App without permission.
        </Section>

        <Section title="Collection Information">
          TH-Hunter provides vehicle information to help collectors organize
          and track their collections.

          {"\n\n"}

          While reasonable efforts are made to provide accurate information,
          we do not guarantee that all vehicle names, series information, case
          information, release information, images, or other data are
          complete, current, or error-free.

          {"\n\n"}

          Information may be updated, corrected, or changed without notice.

          {"\n\n"}

          TH-Hunter should not be relied upon as an official source for
          product availability, retail inventory, pricing, release schedules,
          or other commercial information.
        </Section>

        <Section title="Third-Party Trademarks">
          TH-Hunter is an independent collector application and is not
          affiliated with, sponsored by, endorsed by, or officially connected
          with Mattel, Hot Wheels, or any of their subsidiaries or affiliates.

          {"\n\n"}

          Hot Wheels, Treasure Hunt, Super Treasure Hunt, and related names,
          logos, and trademarks belong to their respective owners.

          {"\n\n"}

          Any third-party names, trademarks, product names, or other
          intellectual property referenced within the App are used for
          identification and informational purposes only.
        </Section>

        <Section title="Intellectual Property">
          The TH-Hunter application, including its original software, user
          interface, graphics, design, text, and other original content, is
          owned by or licensed to TH-Hunter and is protected by applicable
          intellectual property laws.

          {"\n\n"}

          You may not reproduce, redistribute, modify, sell, or create
          derivative works from the App or its original content without
          permission, except where permitted by applicable law.

          {"\n\n"}

          Third-party trademarks, vehicle names, and other third-party
          intellectual property remain the property of their respective
          owners.
        </Section>

        <Section title="Availability of the App">
          We may modify, update, suspend, or discontinue any part of the App
          at any time.

          {"\n\n"}

          We do not guarantee that the App will always be available,
          uninterrupted, secure, or free from errors.

          {"\n\n"}

          Features and functionality may change as TH-Hunter is updated.
        </Section>

        <Section title="Disclaimer">
          TH-Hunter is provided on an "as is" and "as available" basis.

          {"\n\n"}

          To the fullest extent permitted by law, we make no warranties or
          representations regarding the accuracy, reliability, availability,
          or completeness of information provided through the App.

          {"\n\n"}

          TH-Hunter does not guarantee that users will find particular
          vehicles, complete a collection, or locate products at any
          particular retailer.
        </Section>

        <Section title="Limitation of Liability">
          To the fullest extent permitted by applicable law, TH-Hunter and
          its developer will not be liable for any indirect, incidental,
          special, consequential, or other damages arising from or related
          to your use of, or inability to use, the App.

          {"\n\n"}

          This includes, without limitation, losses resulting from reliance
          on information contained within the App, errors in collection data,
          App interruptions, or loss of locally stored collection information.

          {"\n\n"}

          Nothing in these Terms excludes or limits liability where doing so
          would be prohibited by applicable law.
        </Section>

        <Section title="Updates to These Terms">
          We may update these Terms from time to time.

          {"\n\n"}

          When changes are made, the "Last Updated" date at the top of this
          page will be updated. Continued use of TH-Hunter after changes
          become effective constitutes acceptance of the revised Terms.
        </Section>

        <Section title="Termination">
          You may stop using TH-Hunter at any time by uninstalling the App.

          {"\n\n"}

          We may restrict or terminate access to the App if necessary to
          protect the App, its users, or our systems, or if you violate these
          Terms.
        </Section>

        <Section title="Governing Law">
          These Terms will be governed by and interpreted in accordance with
          the laws applicable to the developer's jurisdiction, except where
          applicable law requires otherwise.
        </Section>

        <Section title="Contact">
          If you have questions, concerns, or feedback regarding these Terms
          or TH-Hunter, you may contact the developer through the contact
          information provided within the App or its official support
          channels.
        </Section>
      </ScrollView>
    </View>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.body}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },

  content: {
    padding: 18,
    paddingBottom: 40,
  },

  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingBottom: 20,
  },

  eyebrow: {
    color: "#FBBF24",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.2,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "900",
  },

  closeButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111111",
    borderWidth: 1,
    borderColor: "#292929",
  },

  updated: {
    color: "#77777C",
    fontSize: 11,
    marginBottom: 18,
  },

  section: {
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "#292929",
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
    marginBottom: 6,
  },

  body: {
    color: "#A1A1A6",
    fontSize: 14,
    lineHeight: 21,
  },
});

