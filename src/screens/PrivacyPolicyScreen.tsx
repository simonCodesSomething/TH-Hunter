import React from "react";
import {
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { styles } from "../styles/privacyPolicy.styles";

interface PrivacyPolicyScreenProps {
  onBack: () => void;
}

const PRIVACY_EMAIL = "developerSims@icloud.com";
const GOOGLE_PRIVACY_URL = "https://policies.google.com/privacy";

export default function PrivacyPolicyScreen({
  onBack,
}: PrivacyPolicyScreenProps) {
  const openPrivacyEmail = () => {
    void Linking.openURL(
      `mailto:${PRIVACY_EMAIL}?subject=TH%20Hunter%20Privacy%20Inquiry`
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.eyebrow}>TH HUNTER</Text>
            <Text style={styles.title}>PRIVACY POLICY</Text>
          </View>

          <Pressable
            style={styles.closeButton}
            onPress={onBack}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Close privacy policy"
          >
            <Ionicons name="close" size={28} color="#FFFFFF" />
          </Pressable>
        </View>

        <Text style={styles.updated}>
          Last updated: November 9, 2026
        </Text>

        <Text style={styles.body}>
          TH Hunter helps users browse Hot Wheels Treasure Hunt and Super
          Treasure Hunt cars and track their personal collections. This
          Privacy Policy explains how information is stored, accessed,
          and processed when you use the app.
        </Text>

        <Section title="Collection information">
          Your collected-car selections, collection progress, and
          collection photos are stored locally on your device. TH Hunter
          does not require an account or upload your personal collection
          to our backend. Removing the app or clearing its data may delete
          this locally stored information.
        </Section>

        <Section title="Photos">
          You may choose photos from your device's photo library to
          associate with cars in your collection. These photos are used
          locally within the app and are not uploaded to our servers.
          Photo library access is requested only when you use this feature.
          You can decline photo access and continue using other app features.
        </Section>

        <Section title="Catalog and backend services">
          TH Hunter uses Supabase to retrieve reference information,
          including car listings and catalog updates. The app does not
          send your personal collection or selected photos to Supabase.
          Network requests may involve technical information such as
          IP addresses and request metadata processed by the service
          provider.
        </Section>

        <Section title="Advertising">
          TH Hunter displays advertisements provided by Google AdMob.
          Google and its advertising partners may collect or process
          advertising identifiers, IP addresses, device information,
          interactions with advertisements, and diagnostic information.
          {"\n\n"}
          This information may be used to deliver advertisements, measure
          advertising performance, prevent fraud, and maintain advertising
          services. Depending on applicable laws, your location, device
          settings, and available privacy choices, ads may be personalized
          or non-personalized. Choosing non-personalized advertising does
          not necessarily prevent all data collection or processing.
          {"\n\n"}
          Learn more about Google's data practices:
        </Section>

        <Pressable
          onPress={() => void Linking.openURL(GOOGLE_PRIVACY_URL)}
          accessibilityRole="link"
          accessibilityLabel="Open Google Privacy Policy"
        >
          <Text style={styles.link}>Google Privacy Policy</Text>
        </Pressable>

        <Section title="Advertising privacy choices">
          Depending on your location and applicable privacy laws, Google
          may provide additional choices about how your information is used
          for advertising.
          {"\n\n"}
          Where available, these controls can be accessed through the
          Privacy choices option in TH Hunter's About screen. You may
          also manage certain advertising preferences through your
          device and Google account settings.
        </Section>

        <Section title="Optional support purchases">
          TH Hunter offers an optional one-time support purchase processed
          through Google Play Billing. This contribution supports app
          development and does not unlock additional features or remove
          advertisements.
          {"\n\n"}
          Google Play processes payment and transaction information under
          its own policies. TH Hunter receives purchase status and
          transaction information needed to complete the purchase. We do
          not directly receive or store your full payment card details.
        </Section>

        <Section title="Accounts and personal information">
          TH Hunter does not require account creation, and we do not
          operate a user account database for the app. Third-party
          services such as Google AdMob and Google Play may process
          information as described in this policy.
        </Section>

        <Section title="Data sharing">
          TH Hunter does not sell your personal collection information
          or upload your collection photos to third parties.
          {"\n\n"}
          Advertising, billing, and backend providers may process
          technical or transaction information to provide their services,
          subject to their privacy policies and applicable laws.
        </Section>

        <Section title="Data security">
          TH Hunter uses HTTPS connections to communicate with its
          backend and integrated services.
          {"\n\n"}
          Personal collection records and photos are stored locally on
          your device. Their protection also depends on your device's
          security settings and operating system. No method of electronic
          storage or transmission can be guaranteed completely secure.
        </Section>

        <Section title="Data retention and deletion">
          Collection records and photos stored locally remain on your
          device until you remove them through available app controls,
          clear the app's data, or uninstall the app, subject to your
          device's backup settings.
          {"\n\n"}
          Data processed by Google and other providers may be retained
          according to their respective policies. For questions about
          information associated with TH Hunter, contact us below.
        </Section>

        <Section title="Children's privacy">
          TH Hunter is intended for collectors and is not specifically
          directed toward children. We do not knowingly request personal
          information directly from children. Advertising and purchase
          functionality are provided through Google services and are
          subject to applicable platform policies.
        </Section>

        <Section title="Changes to this policy">
          We may update this Privacy Policy to reflect changes in
          TH Hunter, its services, or applicable requirements. Updated
          versions will include a revised date and will be made available
          through the app.
        </Section>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact</Text>
          <Text style={styles.body}>
            If you have questions about this Privacy Policy or TH Hunter's
            data practices, contact:
          </Text>
          <Pressable
            onPress={openPrivacyEmail}
            accessibilityRole="link"
            style={styles.emailButton}
          >
            <Ionicons name="mail-outline" size={17} color="#FBBF24" />
            <Text style={styles.emailText}>{PRIVACY_EMAIL}</Text>
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
