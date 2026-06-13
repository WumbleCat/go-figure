import React, { useCallback, useMemo, useState } from 'react';
import { View, TextInput, Text, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useFigures } from '../context/FiguresContext';
import type { Figure } from '../engine/loadFigures';
import { colors, fonts, spacing } from '../theme';

type Props = {
  onGuess: (id: string) => void;
  disabled?: boolean;
};

const MAX_RESULTS = 6;

type SearchEntry = { figure: Figure; haystack: string };

export function GuessInput({ onGuess, disabled }: Props) {
  const { figures } = useFigures();
  const [query, setQuery] = useState('');

  const index = useMemo<SearchEntry[]>(
    () =>
      figures.map(f => ({
        figure: f,
        haystack: (f.name + '\0' + f.aliases.join('\0')).toLowerCase(),
      })),
    [figures]
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const out: Figure[] = [];
    for (let i = 0; i < index.length && out.length < MAX_RESULTS; i++) {
      if (index[i].haystack.includes(q)) out.push(index[i].figure);
    }
    return out;
  }, [query, index]);

  const handlePick = useCallback(
    (id: string) => {
      onGuess(id);
      setQuery('');
    },
    [onGuess]
  );

  return (
    <View style={styles.wrap}>
      {results.length > 0 && (
        <View style={styles.list}>
          {results.map(f => (
            <ResultRow key={f.id} figure={f} onPick={handlePick} />
          ))}
        </View>
      )}
      <View style={styles.inputRow}>
        <Feather name="search" size={16} color={colors.inkMuted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Name the figure"
          placeholderTextColor={colors.inkMuted}
          editable={!disabled}
          style={styles.input}
          autoCapitalize="words"
          autoCorrect={false}
          returnKeyType="search"
        />
      </View>
    </View>
  );
}

const ResultRow = React.memo(function ResultRow({
  figure,
  onPick,
}: {
  figure: Figure;
  onPick: (id: string) => void;
}) {
  const press = useCallback(() => onPick(figure.id), [figure.id, onPick]);
  return (
    <Pressable
      onPress={press}
      android_disableSound
      hitSlop={4}
      style={resultRowStyle}
    >
      <Text style={styles.itemName}>{figure.name}</Text>
      {figure.aliases.length > 0 && (
        <Text style={styles.itemAlias}>also {figure.aliases.join(', ')}</Text>
      )}
    </Pressable>
  );
});

const resultRowStyle = ({ pressed }: { pressed: boolean }) => [
  styles.item,
  pressed && styles.itemPressed,
];

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.paper,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: colors.rule,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  input: {
    flex: 1,
    fontFamily: fonts.sans,
    fontSize: 16,
    color: colors.ink,
    padding: 0,
  },
  list: {
    backgroundColor: colors.paperMuted,
  },
  item: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.rule,
  },
  itemPressed: {
    backgroundColor: colors.rule,
  },
  itemName: {
    fontFamily: fonts.sansMedium,
    fontSize: 15,
    color: colors.ink,
  },
  itemAlias: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.inkMuted,
    marginTop: 2,
  },
});
