import React, {

  useCallback,

  useEffect,

  useMemo,

  useRef,

  useState,

} from "react";

import {

  Alert,

  Image,

  Modal,

  Pressable,

  ScrollView,

  Text,

  View,

} from "react-native";

import {

  Ionicons,

  MaterialCommunityIcons,

} from "@expo/vector-icons";



import {

  getCollectionPhotos,

  getFoundIds,

  toggleFoundId,

} from "../utils/storage";

import { styles } from "../styles/hunt.styles";

import AdBanner from "../components/AdBanner";

import { huntAdStyles } from "../styles/huntAd.styles";

import { useCarData } from "../data/CarDataProvider";

import type { Car } from "../types";



type CarType = "TH" | "STH";

type HuntView = CarType;



const CURRENT_YEAR = new Date().getFullYear();



// Prefer personal collection photos, then public catalog images.

// Keep the existing case artwork when a car has no image yet.

function getCarPhoto(car: Car, collectionPhotos: Record<string, string>): string | null {

  const personalPhoto = collectionPhotos[car.id];

  if (personalPhoto) return personalPhoto;



  const catalogUrl = car.imageKey?.trim();

  return catalogUrl && /^https?:\/\//i.test(catalogUrl) ? catalogUrl : null;

}



const TYPE_META: Record<

  CarType,

  {

    title: string;

    color: string;

    icon: keyof typeof MaterialCommunityIcons.glyphMap;

  }

> = {

  TH: {

    title: "TREASURE HUNTS",

    color: "#FBBF24",

    icon: "fire",

  },

  STH: {

    title: "SUPER TREASURE HUNTS",

    color: "#EF4444",

    icon: "fire",

  },

};



interface HuntScreenProps {

  canRequestAds?: boolean;

}



export default function HuntScreen({ canRequestAds = false }: HuntScreenProps) {

  console.log("[HuntScreen] canRequestAds:", canRequestAds);

  const { cars } = useCarData();

  const [foundIds, setFoundIds] = useState<string[]>([]);

  const [collectionPhotos, setCollectionPhotos] = useState<Record<string, string>>({});

  const [selectedYear, setSelectedYear] =

    useState<number>(CURRENT_YEAR);

  const [selectedType, setSelectedType] =

    useState<HuntView>("STH");

  const [selectedCase, setSelectedCase] =

    useState<string | "ALL">("ALL");

  const [caseDropdownOpen, setCaseDropdownOpen] =

    useState(false);

  const [showYearChips, setShowYearChips] =

    useState(false);

  const caseCarouselRef = useRef<ScrollView | null>(null);



  /*

   * Available years

   */

  const years = useMemo(() => {

    return [...new Set(cars.map((car) => car.year ?? CURRENT_YEAR))]

      .sort((a, b) => b - a);

  }, [cars]);



  /*

   * Load saved hunt progress

   */

  useEffect(() => {

    const loadProgress = async () => {

      const ids = await getFoundIds();

      setFoundIds(ids);

    };



    void loadProgress();

    void getCollectionPhotos().then(setCollectionPhotos);

  }, []);



    /*

     * Toggle a car as found

     */

    const handleToggleFound = useCallback(

      async (id: string) => {

        const nextIds = await toggleFoundId(id);

        setFoundIds(nextIds);

      },

      []

    );



    /*

     * Cars for selected year

     */

    const selectedYearCars = useMemo(() => {

      return cars.filter(

        (car) =>

          (car.year ?? CURRENT_YEAR) === selectedYear

      );

    }, [cars, selectedYear]);



    const thCars = useMemo(

      () => selectedYearCars.filter((car) => car.type === "TH"),

      [selectedYearCars]

    );



    const sthCars = useMemo(

      () => selectedYearCars.filter((car) => car.type === "STH"),

      [selectedYearCars]

    );



    const foundTH = useMemo(

      () => thCars.filter((car) => foundIds.includes(car.id)),

      [thCars, foundIds]

    );



    const foundSTH = useMemo(() => sthCars.filter((car) => foundIds.includes(car.id)), [sthCars, foundIds]);



    /*

     * Missing cars

     */

    const missingTH = useMemo(

      () => thCars.filter((car) => !foundIds.includes(car.id)),

      [thCars, foundIds]

    );



    const missingSTH = useMemo(

      () => sthCars.filter((car) => !foundIds.includes(car.id)),

      [sthCars, foundIds]

    );



    const filteredMissingTH = useMemo(

      () => missingTH.filter((car) => selectedCase === "ALL" || car.caseLetter === selectedCase),

      [missingTH, selectedCase]

    );



    const filteredMissingSTH = useMemo(

      () => missingSTH.filter((car) => selectedCase === "ALL" || car.caseLetter === selectedCase),

      [missingSTH, selectedCase]

    );



    /*

     * Selected type progress

     */

    const caseOptions = useMemo(() => {

      const options = (selectedType === "TH" ? thCars : sthCars).map((car) => car.caseLetter);

      return [...new Set(options)].sort((a, b) => a.localeCompare(b));

    }, [selectedType, thCars, sthCars]);



    const caseItems = useMemo(

      () => [

        { label: "ALL CASES", value: "ALL" },

        ...caseOptions.map((caseLetter) => ({

          label: `CASE ${caseLetter}`,

          value: caseLetter,

        })),

      ],

      [caseOptions]

    );



    useEffect(() => {

      if (selectedCase !== "ALL" && !caseOptions.includes(selectedCase)) {

        setSelectedCase("ALL");

      }

    }, [caseOptions, selectedCase]);



    const filteredTypeCars = useMemo(() => {

      return (selectedType === "TH" ? thCars : sthCars).filter(

        (car) => selectedCase === "ALL" || car.caseLetter === selectedCase

      );

    }, [selectedCase, selectedType, thCars, sthCars]);



    const filteredTypeFound = useMemo(() => {

      return (selectedType === "TH" ? foundTH : foundSTH).filter(

        (car) => selectedCase === "ALL" || car.caseLetter === selectedCase

      );

    }, [selectedCase, selectedType, foundTH, foundSTH]);



    const selectedTypeCars = filteredTypeCars;

    const selectedTypeFound = filteredTypeFound;

    const selectedTypeProgress = selectedTypeCars.length > 0

      ? Math.round((selectedTypeFound.length / selectedTypeCars.length) * 100)

      : 0;

    /*

     * Car card

     */

    const renderCarCard = (car: Car) => {

      const isFound = foundIds.includes(car.id);

      const photoUri = getCarPhoto(car, collectionPhotos);

      const accentColor = TYPE_META[car.type].color;

      const caseLabel = String(car.caseLetter ?? "?").toUpperCase();



      return (

        <Pressable

          key={car.id}

          style={[
  styles.carCard,
  isFound && styles.carCardFound,
  photoUri && {
    borderWidth: 2,
    borderColor: accentColor,
  },
]}

          onPress={() => void handleToggleFound(car.id)}

        >

<View

  style={[

    styles.carImage,

    car.type === "TH" ? styles.carImageTH : styles.carImageSTH,
    ...(photoUri ? [{ backgroundColor: "#FFFFFF" }] : []),

  ]}

>

  {photoUri ? (

    <Image source={{ uri: photoUri }} style={styles.carPhoto} resizeMode="contain" />

  ) : (

    <View

      style={[

        styles.carGraphic,

        car.type === "TH"

          ? styles.carGraphicTH

          : styles.carGraphicSTH,

      ]}

    >

      <MaterialCommunityIcons

        name="fire"

        size={24}

        color={accentColor}

      />



<Text

  style={[

    styles.carGraphicCaseLabel,

    car.type === "STH" && styles.carGraphicTextSTH,

  ]}

>

  CASE

</Text>

      <Text

  style={[

    styles.carGraphicCaseLetter,

    car.type === "STH" && styles.carGraphicTextSTH,

  ]}

>

  {caseLabel}

</Text>

    </View>

  )}

</View>



          <Text style={[styles.carCase, { color: accentColor }]}>

            CASE {caseLabel}

          </Text>

          <Text style={styles.carName} numberOfLines={2}>

            {car.name}

          </Text>

          <Text style={styles.carSeries} numberOfLines={2}>

            {car.series}

          </Text>

        </Pressable>

      );

    };



  /*

   * Empty state

   */

  if (selectedYearCars.length === 0) {

    return (

      <View style={styles.container}>

        <View style={styles.header}>

          <View>

            <Text style={styles.title}>

              HUNT

            </Text>



            <Text style={styles.subtitle}>

              Track your Treasure Hunt finds

            </Text>

          </View>



          <Pressable

            hitSlop={10}

            onPress={() =>

              Alert.alert(

                "How Hunt Works",

                "Tap a TH or STH to mark it as found. Your progress is saved automatically."

              )

            }

          >

            <Ionicons

              name="information-circle-outline"

              size={30}

              color="#FBBF24"

            />

          </Pressable>

        </View>



        <ScrollView

          horizontal

          showsHorizontalScrollIndicator={false}

          contentContainerStyle={styles.yearRow}

        >

          {years.map((year) => {

            const active =

              selectedYear === year;



            return (

              <Pressable

                key={year}

                style={[

                  styles.yearChip,

                  active &&

                    styles.yearChipActive,

                ]}

                onPress={() =>

                  setSelectedYear(year)

                }

              >

                <Text

                  style={[

                    styles.yearChipText,

                    active &&

                      styles.yearChipTextActive,

                  ]}

                >

                  {year}

                </Text>

              </Pressable>

            );

          })}

        </ScrollView>



        <View style={styles.emptyState}>

          <MaterialCommunityIcons

            name="car-outline"

            size={54}

            color="#FBBF24"

          />



          <Text style={styles.emptyTitle}>

            No Hunt Data

          </Text>



          <Text style={styles.emptyText}>

            No {selectedYear} Treasure Hunt data

            is available yet.

          </Text>

        </View>

      </View>

    );

  }



  return (

    <View style={styles.container}>

      {/* HEADER */}

      <View style={styles.header}>

        <View>

          <Text style={styles.eyebrow}>TH HUNTER</Text>

          <Text style={styles.title}>

            HUNT

          </Text>



          <Text style={styles.subtitle}>

            Track your Treasure Hunt finds

          </Text>

        </View>

      </View>



      <ScrollView

        nestedScrollEnabled

        showsVerticalScrollIndicator={false}

        contentContainerStyle={styles.content}

      >

        {/* YEAR SELECTOR */}



        <View style={styles.yearSection}>

          <Pressable

            style={styles.yearSectionHeader}

            onPress={() => setShowYearChips((visible) => !visible)}

          >

            <Text style={styles.sectionTitle}>

              HUNT YEAR

            </Text>



            <View style={styles.yearHeaderAction}>

              <Text

                style={[

                  styles.yearSelectedLabel,

                  { color: TYPE_META[selectedType].color },

                ]}

              >

                {selectedYear}

              </Text>

              <Ionicons

                name={showYearChips ? "chevron-down" : "chevron-up"}

                size={20}

                color={TYPE_META[selectedType].color}

              />

            </View>

          </Pressable>



          {showYearChips && (

            <ScrollView

              horizontal

              showsHorizontalScrollIndicator={false}

              contentContainerStyle={styles.yearRow}

            >

              {years.map((year) => {

                const active =

                  selectedYear === year;



                return (

                  <Pressable

                    key={year}

                    style={[

                      styles.yearChip,

                      active && {

                        backgroundColor: "#111111",

                        borderColor: TYPE_META[selectedType].color,

                      },

                    ]}

                    onPress={() =>

                      setSelectedYear(year)

                    }

                  >

                    <Text

                      style={[

                        styles.yearChipText,

                          active && {

                            color: TYPE_META[selectedType].color,

                          },

                      ]}

                    >

                      {year}

                    </Text>

                  </Pressable>

                );

              })}

            </ScrollView>

          )}



          <View style={styles.typeRow}>

            {(["STH", "TH"] as HuntView[]).map((type) => {

              const active = selectedType === type;



              return (

                <Pressable

                  key={type}

                  style={[

                    styles.typeChip,

                    active && {

                      backgroundColor: TYPE_META[type].color,

                      borderColor: TYPE_META[type].color,

                    },

                  ]}

                  onPress={() => setSelectedType(type)}

                >

                  <Text

                    style={[

                      styles.typeChipText,

                      active && styles.typeChipTextActive,

                    ]}

                  >

                    {type === "TH" ? "TREASURE HUNTS" : "SUPER TREASURE HUNTS"}

                  </Text>

                </Pressable>

              );

            })}

          </View>



          <View style={styles.caseDropdownWrap}>

            <Pressable

              style={styles.caseDropdown}

              onPress={() => setCaseDropdownOpen(true)}

            >

              <Text style={styles.caseDropdownText}>

                {selectedCase === "ALL" ? "ALL CASES" : `CASE ${selectedCase}`}

              </Text>

              <Ionicons name="chevron-down" size={18} color="#FFFFFF" />

            </Pressable>



            <Modal

              visible={caseDropdownOpen}

              transparent

              animationType="slide"

              onRequestClose={() => setCaseDropdownOpen(false)}

            >

              <View style={styles.caseModalOverlay}>

                <Pressable

                  style={styles.caseModalBackdrop}

                  onPress={() => setCaseDropdownOpen(false)}

                />



                <View style={styles.caseModalContent}>

                  <View style={styles.caseModalHeader}>

                    <Text style={styles.caseModalTitle}>SELECT CASE</Text>

                    <Pressable

                      style={styles.caseModalClose}

                      onPress={() => setCaseDropdownOpen(false)}

                      hitSlop={8}

                    >

                      <Ionicons name="close" size={22} color="#FFFFFF" />

                    </Pressable>

                  </View>



                  <ScrollView

                    ref={caseCarouselRef}

                    onLayout={() => {

                      const selectedIndex = caseItems.findIndex(

                        (item) => item.value === selectedCase

                      );



                      caseCarouselRef.current?.scrollTo({

                        y: Math.max(selectedIndex, 0) * 56,

                        animated: false,

                      });

                    }}

                    showsVerticalScrollIndicator={false}

                    snapToInterval={56}

                    snapToAlignment="center"

                    decelerationRate="fast"

                    contentContainerStyle={styles.caseCarousel}

                  >

                    {caseItems.map((item) => {

                      const active = item.value === selectedCase;



                      return (

                        <Pressable

                          key={item.value}

                          style={[

                            styles.caseCarouselItem,

                            active && {

                              backgroundColor: TYPE_META[selectedType].color,

                              borderColor: TYPE_META[selectedType].color,

                            },

                          ]}

                          onPress={() => {

                            setSelectedCase(item.value);

                            setCaseDropdownOpen(false);

                          }}

                        >

                          <Text

                            style={[

                              styles.caseCarouselText,

                              active && styles.caseCarouselTextActive,

                            ]}

                          >

                            {item.label}

                          </Text>

                        </Pressable>

                      );

                    })}

                  </ScrollView>

                </View>

              </View>

            </Modal>

          </View>

        </View>



        {/* OVERALL PROGRESS */}



        <View

          style={[

            styles.heroCard,

            { borderColor: TYPE_META[selectedType].color },

          ]}

        >

          <View style={styles.heroTop}>

            <View>

              <Text

                style={[styles.heroEyebrow,

                  { color: TYPE_META[selectedType].color },

                ]}

              >

                {selectedYear} {TYPE_META[selectedType].title}

              </Text>



              <Text

                style={[

                  styles.heroTitle,

                  { color: TYPE_META[selectedType].color },

                ]}

              >

                {selectedTypeFound.length} / {selectedTypeCars.length}

              </Text>



              <Text

                style={styles.heroSubtitle}

              >

                {TYPE_META[selectedType].title} found

              </Text>

            </View>



            <View

                style={[

                  styles.progressCircle,

                  { borderColor: TYPE_META[selectedType].color },

                ]}

            >

              <Text

                style={

                  styles.progressCircleValue

                }

              >

                {selectedTypeProgress}%

              </Text>



              <Text

                style={

                  styles.progressCircleLabel

                }

              >

                COMPLETE

              </Text>

            </View>

          </View>



          <View style={styles.heroTrack}>

            <View

              style={[

                styles.heroFill,

                {

                  width: `${selectedTypeProgress}%`,

                  backgroundColor: TYPE_META[selectedType].color,

                },

              ]}

            />

          </View>

        </View>



        {/* NEXT TO HUNT */}



        <View

          style={[

            styles.sectionHeader,

            styles.nextSectionHeader,

          ]}

        >

          <Text style={styles.sectionTitle}>

            NEXT TO HUNT

          </Text>

        </View>



        {/* TH */}



        {selectedType === "TH" &&

        filteredMissingTH.length > 0 ? (

          <View style={styles.huntSection}>

            <View

              style={styles.huntSectionHeader}

            >

              <View

                style={[

                  styles.smallTypeIcon,

                  {

                    backgroundColor:

                      TYPE_META.TH.color,

                  },

                ]}

              >

                <Text

                  style={

                    styles.smallTypeIconText

                  }

                >

                  TH

                </Text>

              </View>



              <Text

                style={styles.huntSectionTitle}

              >

                Treasure Hunts

              </Text>



              <Text

                style={[

                  styles.huntSectionCount,

                  {

                    color:

                      TYPE_META.TH.color,

                  },

                ]}

              >

                {filteredMissingTH.length}

              </Text>

            </View>



            <ScrollView

              horizontal

              showsHorizontalScrollIndicator={

                false

              }

              contentContainerStyle={

                styles.cardsRow

              }

            >

              {filteredMissingTH

                .slice(0, 10)

                .map(renderCarCard)}

            </ScrollView>

          </View>

        ) : null}



        {/* STH */}



        {selectedType === "STH" &&

        filteredMissingSTH.length > 0 ? (

          <View style={styles.huntSection}>

            <View

              style={styles.huntSectionHeader}

            >

              <View

                style={[

                  styles.smallTypeIcon,

                  {

                    backgroundColor:

                      TYPE_META.STH.color,

                  },

                ]}

              >

                <Text

                  style={

                    styles.smallTypeIconText

                  }

                >

                  STH

                </Text>

              </View>



              <Text

                style={styles.huntSectionTitle}

              >

                Super Treasure Hunts

              </Text>



              <Text

                style={[

                  styles.huntSectionCount,

                  {

                    color:

                      TYPE_META.STH.color,

                  },

                ]}

              >

                {filteredMissingSTH.length}

              </Text>

            </View>



            <ScrollView

              horizontal

              showsHorizontalScrollIndicator={

                false

              }

              contentContainerStyle={

                styles.cardsRow

              }

            >

              {filteredMissingSTH

                .slice(0, 10)

                .map(renderCarCard)}

            </ScrollView>

          </View>

        ) : null}



        {/* COMPLETE */}



        {selectedTypeFound.length === selectedTypeCars.length &&

        selectedTypeCars.length > 0 ? (

          <View

            style={[

              styles.completeCard,

              { borderColor: TYPE_META[selectedType].color },

            ]}

          >

            <View

              style={[

                styles.completeIcon,

                { backgroundColor: TYPE_META[selectedType].color },

              ]}

            >

              <Ionicons

                name="checkmark"

                size={28}

                color="#111111"

              />

            </View>



            <Text

              style={styles.completeTitle}

            >

              Hunt Complete!

            </Text>

          </View>

        ) : null}



        {/* INLINE AD — between Next to Hunt and Latest Finds */}

        {canRequestAds && (

          <View style={huntAdStyles.container}>

            <AdBanner placement="hunt" canRequestAds={canRequestAds} />

          </View>

        )}



        {/* LATEST FINDS — DISPLAY ONLY */}



        {selectedTypeFound.length > 0 ? (

          <View style={styles.findsSection}>

            <View style={styles.findsHeader}>

              <Text style={styles.sectionTitle}>LATEST FINDS</Text>

              <View

                style={[

                  styles.findsCountBadge,

                  { borderColor: TYPE_META[selectedType].color },

                ]}

              >

                <Text

                  style={[

                    styles.findsCountText,

                    { color: TYPE_META[selectedType].color },

                  ]}

                >

                  {selectedTypeFound.length} COLLECTED

                </Text>

              </View>

            </View>



            <ScrollView

              horizontal

              showsHorizontalScrollIndicator={false}

              contentContainerStyle={styles.cardsRow}

            >

              {selectedTypeFound

                .slice()

                .sort(

                  (a, b) =>

                    foundIds.lastIndexOf(b.id) - foundIds.lastIndexOf(a.id)

                )

                .slice(0, 5)

                .map((car) => {

                  const accent = TYPE_META[car.type].color;

                  const photoUri = getCarPhoto(car, collectionPhotos);

                  const caseLetter = String(car.caseLetter ?? "?").toUpperCase();



                  return (

                    // Display only: no onPress, so a find cannot be removed here.

                    <View

                      key={car.id}

                      style={[
  styles.carCard,
  photoUri && {
    borderWidth: 2,
    borderColor: accent,
  },
]}

                      accessibilityLabel={`${car.name}, case ${caseLetter}, collected`}

                    >

                      <View

                        style={[

                          styles.carImage,

                          car.type === "TH" ? styles.carImageTH : styles.carImageSTH,
                          ...(photoUri ? [{ backgroundColor: "#FFFFFF" }] : []),

                        ]}

                      >

                        {photoUri ? (

                          <Image

                            source={{ uri: photoUri }}

                            style={styles.carPhoto}

                            resizeMode="contain"

                          />

                        ) : (

                          <View

                            style={[

                              styles.carGraphic,

                              car.type === "TH"

                                ? styles.carGraphicTH

                                : styles.carGraphicSTH,

                            ]}

                          >

                            <MaterialCommunityIcons

                              name="fire"

                              size={24}

                              color={accent}

                            />

                            <Text

                              style={[

                                styles.carGraphicCaseLabel,

                                car.type === "STH" && styles.carGraphicTextSTH,

                              ]}

                            >

                              CASE

                            </Text>

                            <Text

                              style={[

                                styles.carGraphicCaseLetter,

                                car.type === "STH" && styles.carGraphicTextSTH,

                              ]}

                            >

                              {caseLetter}

                            </Text>

                          </View>

                        )}



                      </View>



                      <Text style={[styles.carCase, { color: accent }]}>

                        CASE {caseLetter}

                      </Text>

                      <Text style={styles.carName} numberOfLines={2}>

                        {car.name}

                      </Text>

                      <Text style={styles.carSeries} numberOfLines={2}>

                        {car.series}

                      </Text>

                      <Text style={[styles.findsCollectedLabel, { color: accent }]}>

                        COLLECTED

                      </Text>

                    </View>

                  );

                })}

            </ScrollView>

          </View>

        ) : null}



      </ScrollView>

    </View>

  );

}
