import React from "react";
import {
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { styles } from "../styles/termsOfUse.styles";

interface TermsOfUseScreenProps {
  onBack: () => void;
}

const SUPPORT_EMAIL = "developerSims@icloud.com";

export default function TermsOfUseScreen({
  onBack,
}: TermsOfUseScreenProps) {
  const openSupportEmail = () => {
    void Linking.openURL(
      `mailto:${SUPPORT_EMAIL}?subject=TH%20Hunter%20Terms%20Inquiry`
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.eyebrow}>TH HUNTER</Text>
            <Text style={styles.title}>TERMS OF USE</Text>
          </View>

          <Pressable
            style={styles.closeButton}
            onPress={onBack}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Close terms of use"
          >
            <Ionicons name="close" size={28} color="#FFFFFF" />
          </Pressable>
        </View>

        <Text style={styles.updated}>
          Last updated: November 9, 2026
        </Text>

        <Text style={styles.body}>
          These Terms of Use ("Terms") govern your use of the TH Hunter
          mobile application ("App"). By downloading, accessing, or using
          the App, you agree to these Terms.
        </Text>

        <Text style={[styles.body, styles.introParagraph]}>
          If you do not agree with these Terms, please do not use the App.
        </Text>

        <Section title="About TH Hunter">
          TH Hunter is a collector-focused application designed to help
          users browse, track, and manage information about Hot Wheels
          Treasure Hunt (TH) and Super Treasure Hunt (STH) vehicles. The
          App is provided for informational and personal collection-tracking
          purposes.
        </Section>

        <Section title="Use of the App">
          You may use TH Hunter for personal, non-commercial purposes,
          including browsing TH and STH vehicle information, tracking your
          collection, monitoring progress, searching and filtering catalog
          information, and using other features provided by the App.
        </Section>

        <Section title="Advertising">
          TH Hunter is supported in part by advertisements provided by
          third-party advertising services, including Google AdMob.
          {"\n\n"}
          Advertisements may appear in certain areas of the App. The
          presence of an advertisement does not mean TH Hunter or its
          developer endorses the advertiser or its products or services.
          {"\n\n"}
          We do not control the content, availability, or accuracy of
          third-party advertisements. Interactions or transactions with
          advertisers are between you and those advertisers.
          {"\n\n"}
          Advertising providers may process device and usage information
          for ad delivery, measurement, and fraud prevention. See the
          Privacy Policy in the App for more information about advertising
          data practices and available privacy choices.
        </Section>

        <Section title="Optional In-App Purchases">
          TH Hunter offers an optional one-time in-app purchase that
          supports development and maintenance of the App.
          {"\n\n"}
          This purchase is voluntary. It does not unlock additional
          features, digital content, premium access, or advertising removal.
          {"\n\n"}
          Purchases are processed through Google Play Billing and are
          subject to applicable Google Play payment terms and policies.
          Refunds and purchase-related requests are subject to applicable
          Google Play policies and consumer protection laws.
          {"\n\n"}
          TH Hunter may change or discontinue the optional support purchase
          in a future version of the App.
        </Section>

        <Section title="Acceptable Use">
          You agree not to use the App for unlawful purposes, interfere
          with or disrupt the App, attempt unauthorized access to the App
          or its systems, copy or modify the App except where applicable
          law permits, or use automated systems to collect data from the
          App without permission.
        </Section>

        <Section title="Collection Information">
          TH Hunter provides vehicle information to help collectors
          organize and track their collections.
          {"\n\n"}
          While reasonable efforts are made to provide accurate
          information, we do not guarantee that names, series, cases,
          releases, images, or other catalog data are complete, current,
          or error-free. Information may be updated or corrected without
          notice.
          {"\n\n"}
          TH Hunter is not an official source for product availability,
          retail inventory, pricing, or release schedules.
        </Section>

        <Section title="User Collection Photos and Local Data">
          TH Hunter allows you to record collected vehicles and associate
          personal photographs with your collection.
          {"\n\n"}
          You retain ownership of photographs you choose to use in the App
          and are responsible for having the right to use them.
          {"\n\n"}
          Personal collection records and photographs are currently stored
          locally on your device and are not uploaded to TH Hunter's servers.
          Clearing app data, uninstalling the App, changing devices, or
          device-related issues may result in data loss. You are
          responsible for maintaining any backups you want to keep.
        </Section>

        <Section title="Third-Party Trademarks">
          TH Hunter is an independent collector application and is not
          affiliated with, sponsored by, endorsed by, or officially
          connected with Mattel, Hot Wheels, or their affiliates.
          {"\n\n"}
          Hot Wheels, Treasure Hunt, Super Treasure Hunt, and related
          names, logos, and trademarks belong to their respective owners.
          References to third-party intellectual property are for
          identification and informational purposes only.
        </Section>

        <Section title="Intellectual Property">
          TH Hunter's original software, interface, designs, text,
          graphics, and original photographs or other original content,
          where owned or properly licensed by the developer, are protected
          by applicable intellectual property laws.
          {"\n\n"}
          You may not reproduce, redistribute, modify, sell, or create
          derivative works from the App or its original content without
          permission, except as permitted by applicable law.
          {"\n\n"}
          Third-party trademarks, vehicle designs, and other third-party
          intellectual property remain the property of their respective
          owners. Your personal collection photographs remain yours.
        </Section>

        <Section title="Privacy">
          Your use of TH Hunter is also subject to the Privacy Policy
          available in the App.
          {"\n\n"}
          The Privacy Policy describes how data may be accessed,
          collected, used, stored, or shared through the App and its
          integrated services, including advertising providers, and
          describes available privacy choices.
        </Section>

        <Section title="Availability of the App">
          We may modify, update, suspend, or discontinue any part of the
          App at any time. We do not guarantee uninterrupted availability
          or error-free operation. Features may change as the App evolves.
        </Section>

        <Section title="Disclaimer">
          TH Hunter is provided on an "as is" and "as available" basis.
          {"\n\n"}
          To the fullest extent permitted by applicable law, we make no
          warranties regarding the accuracy, reliability, availability,
          or completeness of information provided through the App.
          {"\n\n"}
          TH Hunter does not guarantee that you will find particular
          vehicles, complete a collection, or locate products at any
          retailer.
        </Section>

        <Section title="Limitation of Liability">
          To the fullest extent permitted by applicable law, TH Hunter and
          its developer will not be liable for indirect, incidental,
          special, or consequential damages arising from use of, or
          inability to use, the App.
          {"\n\n"}
          This includes losses resulting from reliance on catalog
          information, data errors, interruptions, or loss of locally
          stored collection information.
          {"\n\n"}
          Nothing in these Terms excludes or limits liability where doing
          so would be prohibited by applicable law.
        </Section>

        <Section title="Updates to These Terms">
          We may revise these Terms from time to time. The "Last updated"
          date will be revised when changes are made. Continued use of
          TH Hunter after revised Terms take effect constitutes acceptance
          of those Terms to the extent permitted by applicable law.
        </Section>

        <Section title="Termination">
          You may stop using TH Hunter at any time by uninstalling it.
          We may restrict or terminate access where necessary to protect
          the App, its users, or our systems, or in response to a violation
          of these Terms.
        </Section>

        <Section title="Governing Law">
          These Terms are governed by applicable laws of the developer's
          jurisdiction, except where mandatory consumer protection or
          other applicable laws require otherwise.
        </Section>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact</Text>
          <Text style={styles.body}>
            If you have questions, concerns, or feedback about these Terms,
            contact:
          </Text>
          <Pressable
            style={styles.emailButton}
            onPress={openSupportEmail}
            accessibilityRole="link"
          >
            <Ionicons name="mail-outline" size={17} color="#FBBF24" />
            <Text style={styles.emailText}>{SUPPORT_EMAIL}</Text>
          </Pressable>
        </View>
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

