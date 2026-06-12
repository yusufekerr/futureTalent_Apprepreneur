import { 
  Info, 
  AlertTriangle, 
  AlertOctagon, 
  Lightbulb, 
  FileText, 
  Trash2, 
  PieChart, 
  ShieldAlert, 
  LayoutGrid, 
  Send, 
  X 
} from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

import { Card } from "@/components/ui/Card";
import { Screen } from "@/components/ui/Screen";
import { usePortfolio } from "@/context/PortfolioContext";
import { colors, radius, shadows, spacing, typography } from "@/design/tokens";
import { generateAIResponse, getApiKey, type ChatMessage } from "@/services/ai";

export default function AIAdvisorScreen() {
  const { assets, metrics, distribution } = usePortfolio();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);

  const flatListRef = useRef<FlatList>(null);

  // Initialize welcome message & check API Key
  useEffect(() => {
    const init = async () => {
      const key = await getApiKey();
      setHasApiKey(!!key);

      setMessages([
        {
          id: "welcome",
          role: "model",
          content: `### Merhaba! Ben sizin Yapay Zeka Yatırım Danışmanınızım. 🤖📈\n\n` +
            `Portföyünüzü optimize etmek, risk dağılımınızı analiz etmek ve yatırım alışkanlıklarınızı geliştirmek için buradayım.\n\n` +
            `**Hızlıca başlamak için aşağıdaki butonları kullanabilir veya bana dilediğiniz soruyu yazabilirsiniz:**`,
          timestamp: new Date()
        }
      ]);
    };
    init();
  }, []);

  // Clear message history
  const handleClearHistory = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: "model",
        content: `### Geçmiş Temizlendi 🗑️\n\n` +
          `AI Danışman hafızası sıfırlandı. Yeni bir analiz başlatmak için bana soru sorabilir veya aşağıdaki hızlı butonları kullanabilirsiniz.`,
        timestamp: new Date()
      }
    ]);
  };

  // Send a message
  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isGenerating) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: textToSend.trim(),
      timestamp: new Date()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputText("");
    setIsGenerating(true);

    // Scroll to bottom
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      const answer = await generateAIResponse(updatedMessages, {
        assets,
        metrics,
        distribution
      });

      const modelMessage: ChatMessage = {
        id: `model-${Date.now()}`,
        role: "model",
        content: answer,
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, modelMessage]);
    } catch {
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: "model",
        content: `> [!CAUTION]\n> Bir bağlantı hatası oluştu. Lütfen API anahtarınızı veya internet bağlantınızı kontrol edin.`,
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsGenerating(false);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 150);
    }
  };

  // Simple custom renderer to handle markdown, alerts and formatting
  const renderMessageContent = (text: string) => {
    const lines = text.split("\n");
    let alertType: "note" | "warning" | "caution" | "tip" | null = null;
    let alertLines: string[] = [];

    const parsedElements = [];

    // Custom helper to parse bold text **like this**
    const parseBoldText = (str: string, keyPrefix: string) => {
      const parts = str.split(/\*\*([^*]+)\*\*/g);
      return parts.map((part, index) => {
        // Odd indexes are the matched bold groups
        if (index % 2 === 1) {
          return (
            <Text key={`${keyPrefix}-bold-${index}`} style={styles.boldText}>
              {part}
            </Text>
          );
        }
        return part;
      });
    };

    const flushAlert = (key: string) => {
      if (!alertType) return null;
      let alertTitle = "BİLGİ";
      let AlertIconComponent = Info;
      let alertBg = "#F3F4F6";
      let alertBorderColor = "#D1D5DB";
      let alertTextColor = "#4B5563";

      if (alertType === "warning") {
        alertTitle = "UYARI";
        AlertIconComponent = AlertTriangle;
        alertBg = "#FEF3C7";
        alertBorderColor = "#F59E0B";
        alertTextColor = "#B45309";
      } else if (alertType === "caution") {
        alertTitle = "DİKKAT";
        AlertIconComponent = AlertOctagon;
        alertBg = "#FEE2E2";
        alertBorderColor = "#EF4444";
        alertTextColor = "#B91C1C";
      } else if (alertType === "tip") {
        alertTitle = "İPUCU";
        AlertIconComponent = Lightbulb;
        alertBg = "#ECFDF5";
        alertBorderColor = "#10B981";
        alertTextColor = "#047857";
      } else if (alertType === "note") {
        alertTitle = "NOT";
        AlertIconComponent = FileText;
        alertBg = "#EFF6FF";
        alertBorderColor = "#3B82F6";
        alertTextColor = "#1D4ED8";
      }

      const alertBody = alertLines.join("\n");
      alertType = null;
      alertLines = [];

      return (
        <View key={key} style={[styles.alertContainer, { backgroundColor: alertBg, borderColor: alertBorderColor }]}>
          <View style={styles.alertHeader}>
            <AlertIconComponent size={18} color={alertBorderColor} />
            <Text style={[styles.alertTitle, { color: alertTextColor }]}>{alertTitle}</Text>
          </View>
          <Text style={[styles.alertBodyText, { color: colors.textPrimary }]}>
            {parseBoldText(alertBody, key)}
          </Text>
        </View>
      );
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Check for markdown block alert (e.g. > [!NOTE])
      if (line.startsWith("> [!")) {
        // Flush any existing alert first
        if (alertType) {
          parsedElements.push(flushAlert(`alert-flush-${i}`));
        }
        const typeMatch = line.match(/> \[\!([A-Z]+)\]/);
        if (typeMatch) {
          alertType = typeMatch[1].toLowerCase() as "note" | "warning" | "caution" | "tip";
        }
        continue;
      }

      if (line.startsWith(">") && alertType) {
        // Remove the leading '>' and add line to buffer
        alertLines.push(line.replace(/^>\s?/, ""));
        continue;
      }

      // If we were parsing an alert, but the line doesn't start with '>'
      if (alertType && !line.startsWith(">")) {
        parsedElements.push(flushAlert(`alert-flush-end-${i}`));
      }

      // Check headers (e.g. ### Title)
      if (line.startsWith("###")) {
        const cleanHeader = line.replace(/^###\s?/, "");
        parsedElements.push(
          <Text key={`h3-${i}`} style={styles.mdH3}>
            {parseBoldText(cleanHeader, `h3-${i}`)}
          </Text>
        );
      }
      // Check list items (e.g. - list item)
      else if (line.startsWith("- ") || line.startsWith("* ")) {
        const cleanListItem = line.substring(2);
        parsedElements.push(
          <View key={`li-${i}`} style={styles.mdListItem}>
            <Text style={styles.mdBullet}>•</Text>
            <Text style={styles.mdListText}>
              {parseBoldText(cleanListItem, `li-${i}`)}
            </Text>
          </View>
        );
      }
      // Check empty lines
      else if (line.trim() === "") {
        parsedElements.push(<View key={`empty-${i}`} style={{ height: spacing.xs }} />);
      }
      // Regular line
      else {
        parsedElements.push(
          <Text key={`p-${i}`} style={styles.mdParagraph}>
            {parseBoldText(line, `p-${i}`)}
          </Text>
        );
      }
    }

    // Flush any remaining alert at the end
    if (alertType) {
      parsedElements.push(flushAlert(`alert-flush-final`));
    }

    return parsedElements;
  };

  return (
    <Screen scroll={false}>
      {/* SCREEN HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>AI Danışman</Text>
          <View style={styles.statusBadge}>
            <View style={[styles.statusDot, { backgroundColor: hasApiKey ? colors.success : colors.warning }]} />
            <Text style={styles.statusText}>
              {hasApiKey ? "Canlı (Gemini 2.5)" : "Çevrimdışı Simülatör"}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.settingsButton} 
          onPress={handleClearHistory}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          <Trash2 size={22} color={colors.danger} />
        </TouchableOpacity>
      </View>

      {/* MESSAGES LIST */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
        renderItem={({ item }) => {
          const isUser = item.role === "user";
          return (
            <View style={[styles.messageBubbleWrapper, isUser ? styles.userBubbleWrapper : styles.modelBubbleWrapper]}>
              <View style={[styles.bubble, isUser ? styles.userBubble : styles.modelBubble]}>
                {isUser ? (
                  <Text style={styles.userBubbleText}>{item.content}</Text>
                ) : (
                  <View style={styles.modelContentWrap}>
                    {renderMessageContent(item.content)}
                  </View>
                )}
              </View>
            </View>
          );
        }}
        ListFooterComponent={
          isGenerating ? (
            <View style={styles.loadingBubble}>
              <ActivityIndicator size="small" color={colors.textSecondary} style={{ marginRight: 8 }} />
              <Text style={styles.loadingText}>Yazıyor...</Text>
            </View>
          ) : null
        }
      />

      {/* QUICK CHIPS */}
      {messages.length < 5 && !isGenerating && (
        <View style={styles.quickChipsWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickChipsScroll}>
            <TouchableOpacity style={styles.chip} onPress={() => handleSendMessage("Portföyümü analiz et")}>
              <PieChart size={16} color={colors.textPrimary} />
              <Text style={styles.chipText}>Portföy Analizi</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.chip} onPress={() => handleSendMessage("Risk analizi yap")}>
              <ShieldAlert size={16} color={colors.textPrimary} />
              <Text style={styles.chipText}>Risk Ölçümü</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.chip} onPress={() => handleSendMessage("Çeşitlendirme önerisi ver")}>
              <LayoutGrid size={16} color={colors.textPrimary} />
              <Text style={styles.chipText}>Çeşitlendirme Tavsiyesi</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}

      {/* BOTTOM INPUT BAR */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        style={styles.inputContainer}
      >
        <TextInput
          style={styles.textInput}
          placeholder="AI Danışmana sorun..."
          placeholderTextColor={colors.textMuted}
          value={inputText}
          onChangeText={setInputText}
          editable={!isGenerating}
          multiline={false}
          onSubmitEditing={() => handleSendMessage(inputText)}
        />
        <TouchableOpacity
          style={[styles.sendButton, { opacity: inputText.trim() === "" || isGenerating ? 0.5 : 1 }]}
          disabled={inputText.trim() === "" || isGenerating}
          onPress={() => handleSendMessage(inputText)}
        >
          <Send size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  headerTitle: {
    fontSize: typography.h2,
    fontWeight: "900",
    color: colors.textPrimary
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6
  },
  statusText: {
    fontSize: typography.caption,
    fontWeight: "700",
    color: colors.textSecondary
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border
  },
  listContent: {
    paddingTop: spacing.md,
    paddingBottom: 100,
    gap: spacing.md
  },
  messageBubbleWrapper: {
    width: "100%",
    flexDirection: "row",
    marginVertical: 2
  },
  userBubbleWrapper: {
    justifyContent: "flex-end"
  },
  modelBubbleWrapper: {
    justifyContent: "flex-start"
  },
  bubble: {
    maxWidth: "85%",
    padding: spacing.md,
    borderRadius: radius.lg
  },
  userBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
    ...shadows.sm
  },
  modelBubble: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm
  },
  userBubbleText: {
    color: "#FFFFFF",
    fontSize: typography.body,
    fontWeight: "600",
    lineHeight: 20
  },
  modelContentWrap: {
    gap: spacing.xs
  },
  mdH3: {
    fontSize: typography.h3,
    fontWeight: "800",
    color: colors.textPrimary,
    marginTop: spacing.xs,
    marginBottom: 4
  },
  mdListItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingLeft: spacing.xs,
    marginVertical: 2
  },
  mdBullet: {
    fontSize: 16,
    color: colors.textSecondary,
    marginRight: spacing.xs,
    lineHeight: 18
  },
  mdListText: {
    flex: 1,
    fontSize: typography.body,
    color: colors.textSecondary,
    lineHeight: 20
  },
  mdParagraph: {
    fontSize: typography.body,
    color: colors.textSecondary,
    lineHeight: 22
  },
  boldText: {
    fontWeight: "800",
    color: colors.textPrimary
  },
  alertContainer: {
    borderLeftWidth: 4,
    borderRadius: radius.sm,
    padding: spacing.md,
    marginVertical: spacing.sm,
    gap: 4
  },
  alertHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },
  alertTitle: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.5
  },
  alertBodyText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "500"
  },
  loadingBubble: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceHighlight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: colors.border,
    marginLeft: spacing.xs,
    marginTop: spacing.sm
  },
  loadingText: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    fontWeight: "700"
  },
  quickChipsWrapper: {
    paddingVertical: spacing.xs
  },
  quickChipsScroll: {
    gap: spacing.xs,
    paddingHorizontal: 2
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    gap: 6,
    ...shadows.sm
  },
  chipText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textPrimary
  },
  inputContainer: {
    flexDirection: "row",
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    alignItems: "center",
    gap: spacing.sm
  },
  textInput: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: Platform.OS === "ios" ? 14 : 10,
    fontSize: typography.body,
    color: colors.textPrimary,
    ...shadows.sm
  },
  sendButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    ...shadows.sm
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl
  },
  settingsCard: {
    width: "100%",
    maxWidth: 340,
    padding: spacing.lg,
    gap: spacing.md,
    ...shadows.md
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  modalTitle: {
    fontSize: typography.h3,
    fontWeight: "800",
    color: colors.textPrimary
  },
  modalBody: {
    gap: spacing.md,
    marginTop: spacing.xs
  },
  modalLabel: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    fontWeight: "700",
    textTransform: "uppercase"
  },
  modalInput: {
    backgroundColor: colors.surfaceHighlight,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: typography.body,
    color: colors.textPrimary
  },
  modalInfo: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16
  },
  apiLink: {
    alignSelf: "flex-start"
  },
  apiLinkLabel: {
    fontSize: 13,
    color: colors.secondary,
    fontWeight: "700"
  },
  modalActions: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.sm
  },
  modalBtn: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: "center"
  },
  clearBtn: {
    backgroundColor: "rgba(239, 68, 68, 0.08)"
  },
  clearBtnText: {
    color: colors.danger,
    fontWeight: "700",
    fontSize: 13
  },
  saveBtn: {
    backgroundColor: colors.primary
  },
  saveBtnText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 13
  }
});
