/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AhomWord {
  word_id: string;
  ahom_script: string;
  phonetic_spelling: string;
  assamese_meaning: string;
  english_meaning: string;
  historical_context: string;
}

export interface BarAmraDictionary {
  dictionary_name: string;
  author_legacy: string;
  words: AhomWord[];
}
