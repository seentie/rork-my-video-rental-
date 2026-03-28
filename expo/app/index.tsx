import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  TextInput,
  Modal,
  Platform,
  SafeAreaView,
  KeyboardAvoidingView,
  useWindowDimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Edit3, Shuffle, Eye, EyeOff, Popcorn, RotateCcw, Trash2, Plus, Film, Settings, BookOpen } from "lucide-react-native";
import { useStore } from "@/hooks/store-context";
import { VHSTape } from "@/components/VHSTape";
import { NeonSign } from "@/components/NeonSign";
import { SnackBar } from "@/components/SnackBar";
import { movies } from "@/data/movies";
import { snacks } from "@/data/snacks";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";

const getSnackByName = (name: string) => snacks.find(s => s.name === name);
const getTotalPrice = (selectedSnacks: string[]) => {
  return selectedSnacks.reduce((total, snackName) => {
    const snack = getSnackByName(snackName);
    return total + (snack ? parseFloat(snack.price) : 0);
  }, 0);
};

export default function VideoStore() {
  const { width: screenWidth } = useWindowDimensions();
  const { 
    storeName, 
    setStoreName, 
    selectedSnacks, 
    toggleSnack, 
    setSelectedMovie,
    customMovies,
    setCustomMovies,
    useCustomMovies,
    setUseCustomMovies
  } = useStore();
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(storeName);
  const [selectedTapes, setSelectedTapes] = useState<(typeof movies[0] | { id: string; title: string; year: string; genre: string; color: string; runtime?: string; rating?: string; description?: string; })[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [isShuffling, setIsShuffling] = useState(false);
  const [mysteryMode, setMysteryMode] = useState(false);
  const [showSnackBar, setShowSnackBar] = useState(false);
  const [chosenIndex, setChosenIndex] = useState<number | null>(null);
  const [isRevealing, setIsRevealing] = useState(false);
  const [mysteryRevealed, setMysteryRevealed] = useState<boolean[]>([false, false, false]);
  const [mysteryShuffling, setMysteryShuffling] = useState(false);
  const [showCustomMovieModal, setShowCustomMovieModal] = useState(false);
  const [showEnjoyMovie, setShowEnjoyMovie] = useState(false);
  const [customMovieInputs, setCustomMovieInputs] = useState([
    { title: '', year: '', genre: '' },
    { title: '', year: '', genre: '' },
    { title: '', year: '', genre: '' }
  ]);
  
  const tapeAnimations = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;
  const revealAnimations = useRef([
    new Animated.ValueXY({ x: 0, y: 0 }),
    new Animated.ValueXY({ x: 0, y: 0 }),
    new Animated.ValueXY({ x: 0, y: 0 }),
  ]).current;
  const scaleAnimations = useRef([
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1),
  ]).current;
  const rotateAnimations = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  useEffect(() => {
    selectRandomTapes();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectRandomTapes = (genre?: string) => {
    let moviePool: (typeof movies[0] | typeof customMovies[0])[] = [];
    
    if (useCustomMovies && customMovies.length >= 3) {
      moviePool = [...customMovies];
      // Don't filter custom movies by genre
    } else {
      moviePool = [...movies];
      // Filter by genre if specified (only for default movies)
      if (genre && genre !== "New Releases") {
        moviePool = moviePool.filter(movie => 
          movie.genre.toLowerCase().includes(genre.toLowerCase())
        );
      }
      
      // If we don't have enough movies after filtering, use all movies
      if (moviePool.length < 3) {
        moviePool = [...movies];
      }
    }
    
    const shuffled = moviePool.sort(() => Math.random() - 0.5);
    setSelectedTapes(shuffled.slice(0, 3));
  };

  const handleShuffle = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    if (mysteryMode) {
      handleMysteryShuffle();
      return;
    }
    
    setIsShuffling(true);
    setChosenIndex(null);
    setIsRevealing(false);
    
    // Reset all animations
    revealAnimations.forEach(anim => anim.setValue({ x: 0, y: 0 }));
    scaleAnimations.forEach(anim => anim.setValue(1));
    rotateAnimations.forEach(anim => anim.setValue(0));
    
    // Quick shuffle animation
    const shuffleAnims = tapeAnimations.map((anim, index) =>
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 0.5,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: -0.5,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0.5,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ])
    );

    Animated.parallel(shuffleAnims).start(() => {
      // After shuffle, reveal the chosen one
      const chosen = Math.floor(Math.random() * 3);
      setChosenIndex(chosen);
      setIsRevealing(true);
      
      // Animate the reveal
      const revealAnims = [];
      
      for (let i = 0; i < 3; i++) {
        if (i === chosen) {
          // Chosen tape: scale up and center
          revealAnims.push(
            Animated.parallel([
              Animated.timing(scaleAnimations[i], {
                toValue: 1.3,
                duration: 600,
                useNativeDriver: true,
              }),
              Animated.timing(revealAnimations[i], {
                toValue: { x: 0, y: -30 },
                duration: 600,
                useNativeDriver: true,
              }),
            ])
          );
        } else {
          // Other tapes: fall to sides
          const xOffset = i < chosen ? -screenWidth * 0.4 : screenWidth * 0.4;
          const rotation = i < chosen ? -45 : 45;
          
          revealAnims.push(
            Animated.parallel([
              Animated.timing(revealAnimations[i], {
                toValue: { x: xOffset, y: 200 },
                duration: 800,
                useNativeDriver: true,
              }),
              Animated.timing(rotateAnimations[i], {
                toValue: rotation,
                duration: 800,
                useNativeDriver: true,
              }),
              Animated.timing(scaleAnimations[i], {
                toValue: 0.7,
                duration: 800,
                useNativeDriver: true,
              }),
            ])
          );
        }
      }
      
      Animated.parallel(revealAnims).start(() => {
        setIsShuffling(false);
        // Show enjoy movie section after animation completes
        setTimeout(() => {
          setShowEnjoyMovie(true);
        }, 500);
      });
    });
  };

  const handleMysteryShuffle = () => {
    setMysteryShuffling(true);
    setMysteryRevealed([false, false, false]);
    setChosenIndex(null);
    setIsRevealing(false);
    
    // Reset all animations
    revealAnimations.forEach(anim => anim.setValue({ x: 0, y: 0 }));
    scaleAnimations.forEach(anim => anim.setValue(1));
    rotateAnimations.forEach(anim => anim.setValue(0));
    
    // Quick shuffle animation with multiple passes to simulate shuffling
    const shuffleSequence = [];
    
    // Create 3 shuffle passes for a more convincing shuffle effect
    for (let pass = 0; pass < 3; pass++) {
      const passAnims = tapeAnimations.map((anim, index) => {
        // Vary the animation for each tape and pass
        const direction = (pass + index) % 2 === 0 ? 1 : -1;
        const intensity = 0.3 + (pass * 0.2);
        
        return Animated.sequence([
          Animated.timing(anim, {
            toValue: intensity * direction,
            duration: 80,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: -intensity * direction,
            duration: 80,
            useNativeDriver: true,
          }),
        ]);
      });
      
      shuffleSequence.push(Animated.parallel(passAnims));
    }
    
    // Final reset to center
    const resetAnims = tapeAnimations.map(anim =>
      Animated.timing(anim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      })
    );
    
    shuffleSequence.push(Animated.parallel(resetAnims));
    
    // Run the full shuffle sequence
    Animated.sequence(shuffleSequence).start(() => {
      // Shuffle the actual movies behind the mystery covers
      // Create a new shuffled array of the current tapes
      const shuffledTapes = [...selectedTapes].sort(() => Math.random() - 0.5);
      setSelectedTapes(shuffledTapes);
      setMysteryShuffling(false);
    });
  };

  const handleMysteryTapeSelect = (index: number) => {
    if (mysteryShuffling || mysteryRevealed[index]) return;
    
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    const newRevealed = [...mysteryRevealed];
    newRevealed[index] = true;
    setMysteryRevealed(newRevealed);
    
    // Animate the reveal
    Animated.timing(scaleAnimations[index], {
      toValue: 1.1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(scaleAnimations[index], {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
    
    setTimeout(() => {
      setSelectedMovie(selectedTapes[index]);
      router.push("/movie-result");
    }, 800);
  };

  const handleReset = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    setChosenIndex(null);
    setIsRevealing(false);
    setMysteryMode(false);
    setMysteryRevealed([false, false, false]);
    setMysteryShuffling(false);
    setShowEnjoyMovie(false);
    setSelectedGenre(null);
    
    // Reset all animations
    revealAnimations.forEach(anim => anim.setValue({ x: 0, y: 0 }));
    scaleAnimations.forEach(anim => anim.setValue(1));
    rotateAnimations.forEach(anim => anim.setValue(0));
    
    // Select new random tapes
    selectRandomTapes();
  };

  const handleSaveCustomMovies = () => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
    const newMovies = customMovieInputs
      .filter(movie => movie.title.trim() && movie.year.trim() && movie.genre.trim())
      .map((movie, index) => ({
        id: `custom-${Date.now()}-${index}`,
        title: movie.title.trim(),
        year: movie.year.trim(),
        genre: movie.genre.trim(),
        color: colors[index % colors.length],
        runtime: '120 min',
        rating: '8.0',
        description: `A great ${movie.genre.toLowerCase()} movie from ${movie.year}.`
      }));
    
    if (newMovies.length === 3) {
      setCustomMovies(newMovies);
      setUseCustomMovies(true);
      setShowCustomMovieModal(false);
      // Reset and select new tapes
      handleReset();
    }
  };

  const handleCustomMovieInputChange = (index: number, field: string, value: string) => {
    const newInputs = [...customMovieInputs];
    newInputs[index] = { ...newInputs[index], [field]: value };
    setCustomMovieInputs(newInputs);
  };

  const openCustomMovieModal = () => {
    // Always load from persisted customMovies state
    if (customMovies.length === 3) {
      setCustomMovieInputs([
        { title: customMovies[0].title, year: customMovies[0].year, genre: customMovies[0].genre },
        { title: customMovies[1].title, year: customMovies[1].year, genre: customMovies[1].genre },
        { title: customMovies[2].title, year: customMovies[2].year, genre: customMovies[2].genre }
      ]);
    } else {
      setCustomMovieInputs([
        { title: '', year: '', genre: '' },
        { title: '', year: '', genre: '' },
        { title: '', year: '', genre: '' }
      ]);
    }
    setShowCustomMovieModal(true);
  };

  const resetToDefaultMovies = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setUseCustomMovies(false);
    setChosenIndex(null);
    setIsRevealing(false);
    setMysteryMode(false);
    setMysteryRevealed([false, false, false]);
    setMysteryShuffling(false);
    setShowEnjoyMovie(false);
    
    // Reset all animations
    revealAnimations.forEach(anim => anim.setValue({ x: 0, y: 0 }));
    scaleAnimations.forEach(anim => anim.setValue(1));
    rotateAnimations.forEach(anim => anim.setValue(0));
    
    // Select new tapes from default movies with current genre filter
    setTimeout(() => {
      selectRandomTapes(selectedGenre || undefined);
    }, 0);
  };

  const handleGenreSelect = (genre: string) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    // Toggle genre selection
    if (selectedGenre === genre) {
      setSelectedGenre(null);
      selectRandomTapes();
    } else {
      setSelectedGenre(genre);
      selectRandomTapes(genre);
    }
    
    // Reset any ongoing animations
    setChosenIndex(null);
    setIsRevealing(false);
    setMysteryRevealed([false, false, false]);
    setMysteryShuffling(false);
    setShowEnjoyMovie(false);
    
    // Reset all animations
    revealAnimations.forEach(anim => anim.setValue({ x: 0, y: 0 }));
    scaleAnimations.forEach(anim => anim.setValue(1));
    rotateAnimations.forEach(anim => anim.setValue(0));
  };

  const handleTapeSelect = (movie: typeof movies[0] | { id: string; title: string; year: string; genre: string; color: string; runtime?: string; rating?: string; description?: string; }, index?: number) => {
    if (mysteryMode && index !== undefined) {
      handleMysteryTapeSelect(index);
      return;
    }
    
    if (!isRevealing && !mysteryMode) {
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      setSelectedMovie(movie);
      router.push("/movie-result");
    }
  };

  const handleSaveName = () => {
    setStoreName(tempName);
    setEditingName(false);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#1a1a2e", "#0f0f1e"]}
        style={StyleSheet.absoluteFillObject}
      />
      
      {/* Wood grain shelf background */}
      <View style={styles.shelfBackground}>
        {[0, 1, 2, 3].map((i) => (
          <View key={i} style={[styles.shelf, { top: 150 + i * 180 }]} />
        ))}
      </View>

      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Neon Sign */}
          <View style={styles.signContainer}>
            <NeonSign text={storeName} />
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => {
                setTempName(storeName);
                setEditingName(true);
              }}
            >
              <Edit3 color="#FFD700" size={20} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => router.push('/settings')}
            >
              <Settings color="#FFD700" size={20} />
            </TouchableOpacity>
          </View>

          {/* Category Labels */}
          <View style={styles.categoryContainer}>
            <View style={styles.categoryLabel}>
              <Text style={styles.categoryText}>
                {selectedGenre ? selectedGenre.toUpperCase() : (useCustomMovies ? "YOUR CUSTOM PICKS" : "TONIGHT'S PICKS")}
              </Text>
            </View>
          </View>

          {/* VHS Tapes Display */}
          <View style={styles.tapesContainer}>
            {selectedTapes.map((movie, index) => (
              <Animated.View
                key={`${movie.id}-${index}`}
                style={[
                  styles.tapeWrapper,
                  chosenIndex === index && styles.chosenTape,
                  {
                    transform: [
                      {
                        translateX: Animated.add(
                          tapeAnimations[index].interpolate({
                            inputRange: [-0.5, 0, 0.5],
                            outputRange: [-20, 0, 20],
                          }),
                          revealAnimations[index].x
                        ),
                      },
                      {
                        translateY: revealAnimations[index].y,
                      },
                      {
                        rotate: rotateAnimations[index].interpolate({
                          inputRange: [-45, 0, 45],
                          outputRange: ["-45deg", "0deg", "45deg"],
                        }),
                      },
                      {
                        scale: scaleAnimations[index],
                      },
                    ],
                    opacity: isRevealing && chosenIndex !== null && chosenIndex !== index 
                      ? scaleAnimations[index].interpolate({
                          inputRange: [0.7, 1],
                          outputRange: [0.5, 1],
                        })
                      : 1,
                    zIndex: chosenIndex === index ? 10 : 1,
                  },
                ]}
              >
                <TouchableOpacity
                  onPress={() => handleTapeSelect(movie, index)}
                  disabled={isShuffling || (isRevealing && !mysteryMode) || mysteryShuffling}
                  activeOpacity={0.9}
                >
                  <VHSTape 
                    movie={movie} 
                    mysteryMode={mysteryMode && !mysteryRevealed[index]} 
                  />
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>

          {/* Enjoy Your Movie Section */}
          {showEnjoyMovie && chosenIndex !== null && (
            <View style={styles.enjoyMovieContainer}>
              <Text style={styles.enjoyMovieTitle}>TONIGHT&apos;S SELECTION</Text>
              
              <View style={styles.movieSnacksLayout}>
                {/* Selected Movie Info */}
                <View style={styles.selectedMovieInfo}>
                  <Text style={styles.selectedMovieTitle}>{selectedTapes[chosenIndex].title}</Text>
                  <Text style={styles.selectedMovieYear}>({selectedTapes[chosenIndex].year})</Text>
                  <Text style={styles.selectedMovieGenre}>{selectedTapes[chosenIndex].genre}</Text>
                </View>
                
                {/* Snacks Pile */}
                {selectedSnacks.length > 0 && (
                  <View style={styles.enjoySnacksPile}>
                    <Text style={styles.enjoySnacksTitle}>YOUR SNACKS</Text>
                    <View style={styles.enjoySnacksGrid}>
                      {selectedSnacks.map((snackName, index) => {
                        const snack = getSnackByName(snackName);
                        if (!snack) return null;
                        
                        return (
                          <View 
                            key={`${snack.id}-${index}`} 
                            style={[
                              styles.enjoySnackItem,
                              {
                                transform: [
                                  { rotate: `${(Math.random() - 0.5) * 20}deg` },
                                  { translateX: (Math.random() - 0.5) * 8 },
                                  { translateY: (Math.random() - 0.5) * 8 }
                                ]
                              }
                            ]}
                          >
                            <Text style={styles.enjoySnackIcon}>{snack.icon}</Text>
                            <Text style={styles.enjoySnackName}>{snack.name}</Text>
                          </View>
                        );
                      })}
                    </View>
                  </View>
                )}
              </View>
              
              <TouchableOpacity 
                style={styles.enjoyButton}
                onPress={() => {
                  if (Platform.OS !== "web") {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  }
                  setSelectedMovie(selectedTapes[chosenIndex]);
                  router.push("/movie-result");
                }}
              >
                <Text style={styles.enjoyButtonText}>ENJOY YOUR MOVIE!</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Snack Counter */}
          {selectedSnacks.length > 0 && !showEnjoyMovie && (
            <View style={styles.counterContainer}>
              <View style={styles.counterHeader}>
                <Text style={styles.counterTitle}>YOUR SNACKS</Text>
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={() => {
                    selectedSnacks.forEach(snack => toggleSnack(snack));
                  }}
                >
                  <Trash2 color="#FFD700" size={16} />
                  <Text style={styles.clearText}>Clear All</Text>
                </TouchableOpacity>
              </View>
              
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.counterScroll}
                contentContainerStyle={styles.counterContent}
              >
                {selectedSnacks.map((snackName, index) => {
                  const snack = getSnackByName(snackName);
                  if (!snack) return null;
                  
                  return (
                    <TouchableOpacity
                      key={`${snack.id}-${index}`}
                      style={styles.counterItem}
                      onPress={() => toggleSnack(snackName)}
                    >
                      <Text style={styles.counterIcon}>{snack.icon}</Text>
                      <Text style={styles.counterName}>{snack.name}</Text>
                      <Text style={styles.counterPrice}>${snack.price}</Text>
                      <View style={styles.removeButton}>
                        <Text style={styles.removeText}>×</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
              
              <View style={styles.counterFooter}>
                <Text style={styles.totalPrice}>
                  Total: ${getTotalPrice(selectedSnacks).toFixed(2)}
                </Text>
              </View>
            </View>
          )}

          {/* Control Buttons */}
          <ScrollView 
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.controlsContent}
            style={styles.controlsScroll}
          >
            <TouchableOpacity
              style={styles.controlButton}
              onPress={handleShuffle}
              disabled={isShuffling || mysteryShuffling}
            >
              <Shuffle color="#FFD700" size={24} />
              <Text style={styles.controlText}>
                {mysteryMode ? "Mix" : "Shuffle"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => {
                if (!mysteryMode) {
                  // When entering mystery mode, shuffle the movies first
                  const shuffledTapes = [...selectedTapes].sort(() => Math.random() - 0.5);
                  setSelectedTapes(shuffledTapes);
                }
                setMysteryMode(!mysteryMode);
              }}
            >
              {mysteryMode ? (
                <EyeOff color="#FFD700" size={24} />
              ) : (
                <Eye color="#FFD700" size={24} />
              )}
              <Text style={styles.controlText}>
                {mysteryMode ? "Reveal" : "Mystery"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.controlButton}
              onPress={handleReset}
              disabled={isShuffling || mysteryShuffling}
            >
              <RotateCcw color="#FFD700" size={24} />
              <Text style={styles.controlText}>Reset</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => setShowSnackBar(!showSnackBar)}
            >
              <Popcorn color="#FFD700" size={24} />
              <Text style={styles.controlText}>Snacks</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.controlButton}
              onPress={openCustomMovieModal}
            >
              <Plus color="#FFD700" size={24} />
              <Text style={styles.controlText}>Custom</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.watchedLogButton}
              onPress={() => {
                if (Platform.OS !== "web") {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                router.push("/watched-log");
              }}
            >
              <BookOpen color="#005DAA" size={24} />
              <Text style={styles.watchedLogText}>Log</Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Movie Source Indicator */}
          {useCustomMovies && (
            <View style={styles.customIndicator}>
              <Film color="#FFD700" size={16} />
              <Text style={styles.customIndicatorText}>Using Your Custom Movies</Text>
              <TouchableOpacity 
                style={styles.resetToDefaultButton}
                onPress={resetToDefaultMovies}
              >
                <Text style={styles.resetToDefaultText}>Use Default Movies</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Bottom Categories */}
          <View style={styles.bottomCategories}>
            <Text style={styles.sectionTitle}>BROWSE SECTIONS</Text>
            <View style={styles.genreGrid}>
              {["New Releases", "Action", "Comedy", "Drama", "Horror", "Sci-Fi", "Classics"].map((genre) => (
                <TouchableOpacity 
                  key={genre} 
                  style={[
                    styles.genreTag,
                    selectedGenre === genre && styles.genreTagActive
                  ]}
                  onPress={() => handleGenreSelect(genre)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.genreText,
                    selectedGenre === genre && styles.genreTextActive
                  ]}>{genre}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Snack Bar */}
        {showSnackBar && (
          <SnackBar onClose={() => setShowSnackBar(false)} />
        )}

        {/* Edit Name Modal */}
        <Modal
          visible={editingName}
          transparent
          animationType="fade"
          onRequestClose={() => setEditingName(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setEditingName(false)}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Store Name</Text>
              <TextInput
                style={styles.nameInput}
                value={tempName}
                onChangeText={setTempName}
                placeholder="Enter store name"
                placeholderTextColor="#666"
                autoFocus
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setEditingName(false)}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={handleSaveName}
                >
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Custom Movies Modal */}
        <Modal
          visible={showCustomMovieModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowCustomMovieModal(false)}
        >
          <KeyboardAvoidingView 
            style={styles.modalOverlay}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <SafeAreaView style={styles.customMovieModalContainer}>
              <View style={styles.customMovieModalContent}>
                <View style={styles.customMovieHeader}>
                  <Text style={styles.modalTitle}>Enter Your 3 Movies</Text>
                  <View style={styles.headerButtons}>
                    <TouchableOpacity
                      style={styles.clearMoviesButton}
                      onPress={() => {
                        if (Platform.OS !== "web") {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        }
                        // Clear the inputs
                        setCustomMovieInputs([
                          { title: '', year: '', genre: '' },
                          { title: '', year: '', genre: '' },
                          { title: '', year: '', genre: '' }
                        ]);
                      }}
                    >
                      <Trash2 color="#FFD700" size={18} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={() => {
                        setShowCustomMovieModal(false);
                        // Reset inputs to saved state when canceling
                        if (customMovies.length === 3) {
                          setCustomMovieInputs([
                            { title: customMovies[0].title, year: customMovies[0].year, genre: customMovies[0].genre },
                            { title: customMovies[1].title, year: customMovies[1].year, genre: customMovies[1].genre },
                            { title: customMovies[2].title, year: customMovies[2].year, genre: customMovies[2].genre }
                          ]);
                        } else {
                          setCustomMovieInputs([
                            { title: '', year: '', genre: '' },
                            { title: '', year: '', genre: '' },
                            { title: '', year: '', genre: '' }
                          ]);
                        }
                      }}
                    >
                      <Text style={styles.closeButtonText}>×</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                
                <ScrollView 
                  style={styles.customMovieScrollView}
                  contentContainerStyle={styles.customMovieScrollContent}
                  showsVerticalScrollIndicator={true}
                  keyboardShouldPersistTaps="handled"
                  bounces={false}
                >
                  {customMovieInputs.map((movie, index) => (
                    <View key={index} style={styles.movieInputGroup}>
                      <Text style={styles.movieInputLabel}>Movie {index + 1}</Text>
                      <TextInput
                        style={styles.movieInput}
                        value={movie.title}
                        onChangeText={(value) => handleCustomMovieInputChange(index, 'title', value)}
                        placeholder="Movie Title"
                        placeholderTextColor="#999"
                        returnKeyType="next"
                      />
                      <View style={styles.movieInputRow}>
                        <TextInput
                          style={[styles.movieInput, styles.movieInputSmall]}
                          value={movie.year}
                          onChangeText={(value) => handleCustomMovieInputChange(index, 'year', value)}
                          placeholder="Year"
                          placeholderTextColor="#999"
                          keyboardType="numeric"
                          maxLength={4}
                          returnKeyType="next"
                        />
                        <TextInput
                          style={[styles.movieInput, styles.movieInputSmall]}
                          value={movie.genre}
                          onChangeText={(value) => handleCustomMovieInputChange(index, 'genre', value)}
                          placeholder="Genre"
                          placeholderTextColor="#999"
                          returnKeyType={index === 2 ? "done" : "next"}
                        />
                      </View>
                    </View>
                  ))}
                </ScrollView>
                
                <View style={styles.customModalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => {
                      setShowCustomMovieModal(false);
                      // Reset inputs to saved state when canceling
                      if (customMovies.length === 3) {
                        setCustomMovieInputs([
                          { title: customMovies[0].title, year: customMovies[0].year, genre: customMovies[0].genre },
                          { title: customMovies[1].title, year: customMovies[1].year, genre: customMovies[1].genre },
                          { title: customMovies[2].title, year: customMovies[2].year, genre: customMovies[2].genre }
                        ]);
                      } else {
                        setCustomMovieInputs([
                          { title: '', year: '', genre: '' },
                          { title: '', year: '', genre: '' },
                          { title: '', year: '', genre: '' }
                        ]);
                      }
                    }}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.saveButton]}
                    onPress={handleSaveCustomMovies}
                  >
                    <Text style={styles.buttonText}>Save & Use</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </SafeAreaView>
          </KeyboardAvoidingView>
        </Modal>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  shelfBackground: {
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: 0.3,
  },
  shelf: {
    position: "absolute",
    width: "100%",
    height: 4,
    backgroundColor: "#3E2723",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  signContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  editButton: {
    position: "absolute",
    right: 70,
    top: 20,
    padding: 10,
  },
  settingsButton: {
    position: "absolute",
    right: 30,
    top: 20,
    padding: 10,
  },
  categoryContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  categoryLabel: {
    backgroundColor: "#005DAA",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#FFD700",
  },
  categoryText: {
    color: "#FFD700",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 2,
  },
  tapesContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 40,
    minHeight: 340,
  },
  tapeWrapper: {
    marginHorizontal: 10,
    position: "relative" as const,
  },
  chosenTape: {
    elevation: 10,
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
  },
  controlsScroll: {
    marginBottom: 40,
    marginHorizontal: 20,
  },
  controlsContent: {
    flexDirection: "row",
    gap: 15,
    paddingHorizontal: 5,
  },
  controlButton: {
    alignItems: "center",
    padding: 12,
    backgroundColor: "#005DAA",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#FFD700",
    minWidth: 70,
  },
  controlText: {
    color: "#FFD700",
    marginTop: 5,
    fontSize: 12,
    fontWeight: "bold",
  },
  bottomCategories: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    color: "#FFD700",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 1,
    marginBottom: 15,
    textAlign: "center",
  },
  genreGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
  },
  genreTag: {
    backgroundColor: "#2a2a3e",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#FFD700",
  },
  genreTagActive: {
    backgroundColor: "#005DAA",
    borderWidth: 2,
  },
  genreText: {
    color: "#FFD700",
    fontSize: 12,
    fontWeight: "600",
  },
  genreTextActive: {
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#2a2a3e",
    padding: 25,
    borderRadius: 15,
    width: "80%",
    maxWidth: 300,
    borderWidth: 2,
    borderColor: "#FFD700",
  },
  modalTitle: {
    color: "#FFD700",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  nameInput: {
    backgroundColor: "#1a1a2e",
    color: "#fff",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#FFD700",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    minHeight: 50,
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#666",
  },
  saveButton: {
    backgroundColor: "#005DAA",
    borderWidth: 1,
    borderColor: "#FFD700",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  counterContainer: {
    backgroundColor: "#2a2a3e",
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#FFD700",
    overflow: "hidden",
  },
  counterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#005DAA",
  },
  counterTitle: {
    color: "#FFD700",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    padding: 5,
  },
  clearText: {
    color: "#FFD700",
    fontSize: 12,
    fontWeight: "600",
  },
  counterScroll: {
    maxHeight: 120,
  },
  counterContent: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 15,
  },
  counterItem: {
    backgroundColor: "#1a1a2e",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
    minWidth: 80,
    borderWidth: 1,
    borderColor: "#FFD700",
    position: "relative" as const,
  },
  counterIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  counterName: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 2,
  },
  counterPrice: {
    color: "#FFD700",
    fontSize: 11,
    fontWeight: "bold",
  },
  removeButton: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#FF4444",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  removeText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    lineHeight: 16,
  },
  counterFooter: {
    backgroundColor: "#1a1a2e",
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: "center",
  },
  totalPrice: {
    color: "#FFD700",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  customIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2a2a3e",
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FFD700",
    gap: 8,
  },
  customIndicatorText: {
    color: "#FFD700",
    fontSize: 14,
    fontWeight: "600",
  },
  resetToDefaultButton: {
    marginLeft: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#005DAA",
    borderRadius: 6,
  },
  resetToDefaultText: {
    color: "#FFD700",
    fontSize: 12,
    fontWeight: "600",
  },
  customModalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#FFD700",
    backgroundColor: "#1a1a2e",
  },
  customMovieModalContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  customMovieModalContent: {
    backgroundColor: "#2a2a3e",
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#FFD700",
    maxHeight: "80%",
    flex: 1,
    overflow: "hidden",
  },
  customMovieHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#FFD700",
  },
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  clearMoviesButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#005DAA",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFD700",
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#FF4444",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    lineHeight: 22,
  },
  customMovieScrollView: {
    flex: 1,
  },
  customMovieScrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  movieInputGroup: {
    marginBottom: 15,
    padding: 12,
    backgroundColor: "#1a1a2e",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FFD700",
  },
  movieInputLabel: {
    color: "#FFD700",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  movieInput: {
    backgroundColor: "#0f0f1e",
    color: "#fff",
    padding: 10,
    borderRadius: 8,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#FFD700",
    marginBottom: 8,
    minHeight: 40,
  },
  movieInputRow: {
    flexDirection: "row",
    gap: 10,
  },
  movieInputSmall: {
    flex: 1,
    marginBottom: 0,
  },
  enjoyMovieContainer: {
    backgroundColor: "#2a2a3e",
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "#FFD700",
    padding: 25,
    alignItems: "center",
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 15,
  },
  enjoyMovieTitle: {
    color: "#FFD700",
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 3,
    marginBottom: 20,
    textShadowColor: "#005DAA",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  movieSnacksLayout: {
    width: "100%",
    alignItems: "center",
    marginBottom: 25,
  },
  selectedMovieInfo: {
    alignItems: "center",
    marginBottom: 20,
  },
  selectedMovieTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  selectedMovieYear: {
    color: "#FFD700",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  selectedMovieGenre: {
    color: "#FFD700",
    fontSize: 14,
    fontWeight: "bold",
    backgroundColor: "#005DAA",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  enjoySnacksPile: {
    alignItems: "center",
    width: "100%",
  },
  enjoySnacksTitle: {
    color: "#FFD700",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 1,
    marginBottom: 10,
  },
  enjoySnacksGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
  },
  enjoySnackItem: {
    backgroundColor: "#1a1a2e",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    minWidth: 60,
    borderWidth: 1,
    borderColor: "#FFD700",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  enjoySnackIcon: {
    fontSize: 18,
    marginBottom: 4,
  },
  enjoySnackName: {
    color: "#FFD700",
    fontSize: 10,
    fontWeight: "600",
    textAlign: "center",
  },
  enjoyButton: {
    backgroundColor: "#FFD700",
    paddingHorizontal: 35,
    paddingVertical: 15,
    borderRadius: 12,
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  enjoyButtonText: {
    color: "#005DAA",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 2,
  },
  watchedLogButton: {
    alignItems: "center",
    padding: 12,
    backgroundColor: "#FFD700",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#005DAA",
    minWidth: 70,
  },
  watchedLogText: {
    color: "#005DAA",
    marginTop: 5,
    fontSize: 12,
    fontWeight: "bold",
  },
});