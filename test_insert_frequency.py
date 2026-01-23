#!/usr/bin/env python3
"""
TEST 1: INSERT FREQUENCY ANALYSIS
Validates whether voice-to-text inserts occur at ~2% frequency

Usage:
    python test_insert_frequency.py --transcript "path/to/transcript.txt"
    
Or run interactively for manual data entry.
"""

import argparse
import json
from datetime import datetime
from pathlib import Path
import scipy.stats as stats
import numpy as np

class InsertFrequencyTest:
    def __init__(self):
        self.sessions = []
        self.results_file = Path("validation_results.json")
        
    def analyze_transcript(self, transcript_text, inserts_list):
        """
        Analyze a single transcript for insert frequency
        
        Args:
            transcript_text: Full transcript text
            inserts_list: List of words that were inserted (not spoken)
            
        Returns:
            dict with analysis results
        """
        # Count total words
        words = transcript_text.split()
        total_words = len(words)
        
        # Count inserts
        insert_count = len(inserts_list)
        
        # Calculate frequency
        frequency = (insert_count / total_words * 100) if total_words > 0 else 0
        
        return {
            'total_words': total_words,
            'insert_count': insert_count,
            'frequency_percent': round(frequency, 2),
            'inserts': inserts_list,
            'timestamp': datetime.now().isoformat()
        }
    
    def add_session(self, session_data):
        """Add a session to the dataset"""
        self.sessions.append(session_data)
        self._save_results()
        
    def _save_results(self):
        """Save results to JSON file"""
        with open(self.results_file, 'w') as f:
            json.dump({
                'sessions': self.sessions,
                'summary': self.get_summary()
            }, f, indent=2)
    
    def load_results(self):
        """Load existing results"""
        if self.results_file.exists():
            with open(self.results_file, 'r') as f:
                data = json.load(f)
                self.sessions = data.get('sessions', [])
    
    def get_summary(self):
        """Calculate summary statistics"""
        if not self.sessions:
            return None
            
        frequencies = [s['frequency_percent'] for s in self.sessions]
        total_words = sum(s['total_words'] for s in self.sessions)
        total_inserts = sum(s['insert_count'] for s in self.sessions)
        
        return {
            'session_count': len(self.sessions),
            'total_words': total_words,
            'total_inserts': total_inserts,
            'mean_frequency': round(np.mean(frequencies), 2),
            'std_frequency': round(np.std(frequencies), 2),
            'min_frequency': round(min(frequencies), 2),
            'max_frequency': round(max(frequencies), 2)
        }
    
    def run_statistical_test(self):
        """
        Run chi-square test against 2% hypothesis
        
        Returns:
            dict with test results
        """
        if len(self.sessions) < 3:
            return {
                'error': 'Need at least 3 sessions for statistical test',
                'current_sessions': len(self.sessions)
            }
        
        # Observed inserts per session
        observed = [s['insert_count'] for s in self.sessions]
        
        # Expected inserts (2% of words)
        expected = [s['total_words'] * 0.02 for s in self.sessions]
        
        # Chi-square test
        chi2, p_value = stats.chisquare(observed, expected)
        
        # Overall frequency
        total_words = sum(s['total_words'] for s in self.sessions)
        total_inserts = sum(s['insert_count'] for s in self.sessions)
        overall_frequency = (total_inserts / total_words * 100)
        
        # Interpretation
        if p_value < 0.05:
            interpretation = "SIGNIFICANT: Reject null hypothesis. Insert frequency differs from random 2%."
        else:
            interpretation = "NOT SIGNIFICANT: Cannot reject null hypothesis. Consistent with random 2%."
        
        # Check if frequency clusters around 2%
        frequencies = [s['frequency_percent'] for s in self.sessions]
        within_range = sum(1.5 <= f <= 2.5 for f in frequencies)
        within_range_pct = within_range / len(frequencies) * 100
        
        return {
            'chi_square': round(chi2, 4),
            'p_value': round(p_value, 4),
            'significant': p_value < 0.05,
            'interpretation': interpretation,
            'overall_frequency': round(overall_frequency, 2),
            'sessions_within_1.5_2.5_range': within_range,
            'percent_within_range': round(within_range_pct, 1),
            'expected_2_percent': 2.0,
            'deviation_from_expected': round(abs(overall_frequency - 2.0), 2)
        }
    
    def print_report(self):
        """Print comprehensive report"""
        print("\n" + "="*70)
        print("INSERT FREQUENCY ANALYSIS - TEST RESULTS")
        print("="*70)
        
        summary = self.get_summary()
        if not summary:
            print("\nNo sessions recorded yet.")
            return
        
        print(f"\nSESSIONS ANALYZED: {summary['session_count']}")
        print(f"Total words: {summary['total_words']:,}")
        print(f"Total inserts: {summary['total_inserts']}")
        print(f"\nFREQUENCY STATISTICS:")
        print(f"  Mean: {summary['mean_frequency']}%")
        print(f"  Std Dev: {summary['std_frequency']}%")
        print(f"  Range: {summary['min_frequency']}% - {summary['max_frequency']}%")
        
        print(f"\nINDIVIDUAL SESSIONS:")
        for i, session in enumerate(self.sessions, 1):
            print(f"  Session {i}: {session['total_words']} words, "
                  f"{session['insert_count']} inserts ({session['frequency_percent']}%)")
        
        if summary['session_count'] >= 3:
            print(f"\nSTATISTICAL TEST (Chi-Square):")
            test_results = self.run_statistical_test()
            print(f"  Chi-square: {test_results['chi_square']}")
            print(f"  p-value: {test_results['p_value']}")
            print(f"  Significant: {'YES' if test_results['significant'] else 'NO'} (α = 0.05)")
            print(f"\n  {test_results['interpretation']}")
            print(f"\n  Overall frequency: {test_results['overall_frequency']}%")
            print(f"  Expected (2% hypothesis): {test_results['expected_2_percent']}%")
            print(f"  Deviation: {test_results['deviation_from_expected']}%")
            print(f"\n  Sessions within 1.5-2.5% range: {test_results['sessions_within_1.5_2.5_range']} "
                  f"({test_results['percent_within_range']}%)")
            
            print(f"\nCONCLUSION:")
            if 1.7 <= test_results['overall_frequency'] <= 2.3:
                if test_results['percent_within_range'] >= 60:
                    print("  ✅ STRONG EVIDENCE: Frequency clusters tightly around 2%")
                    print("     Pattern suggests non-random coordination signal")
                else:
                    print("  ⚠️  MIXED EVIDENCE: Mean is ~2% but high variance")
                    print("     More sessions needed for conclusive results")
            elif test_results['significant']:
                print(f"  ⚠️  CAUTION: Frequency deviates significantly from 2%")
                print(f"     Pattern exists but different than predicted")
            else:
                print("  ❌ NO EVIDENCE: Frequency not distinguishable from random")
                print("     Consistent with null hypothesis (random noise)")
        else:
            print(f"\n⏳ Need {3 - summary['session_count']} more sessions for statistical test")
        
        print("\n" + "="*70)
        print(f"Results saved to: {self.results_file}")
        print("="*70 + "\n")


def interactive_mode():
    """Run in interactive mode for manual data entry"""
    print("\n🔬 INSERT FREQUENCY TEST - Interactive Mode\n")
    print("This test validates whether voice-to-text inserts occur at ~2% frequency.\n")
    
    test = InsertFrequencyTest()
    test.load_results()
    
    if test.sessions:
        print(f"Loaded {len(test.sessions)} existing sessions.\n")
    
    while True:
        print("\nOptions:")
        print("  1. Add new session")
        print("  2. View results")
        print("  3. Run statistical test")
        print("  4. Exit")
        
        choice = input("\nChoice (1-4): ").strip()
        
        if choice == '1':
            print("\n--- New Session ---")
            print("Paste your transcript or type/paste the total word count:")
            
            transcript_input = input("Transcript or word count: ").strip()
            
            try:
                # Try to parse as number first
                total_words = int(transcript_input)
                words_list = []
            except ValueError:
                # It's a transcript
                words_list = transcript_input.split()
                total_words = len(words_list)
            
            print(f"\nTotal words: {total_words}")
            
            print("\nNow list the INSERT words (words that appeared but you didn't say).")
            print("Enter one per line. Press Enter on empty line when done:")
            
            inserts = []
            while True:
                insert = input("Insert word: ").strip()
                if not insert:
                    break
                inserts.append(insert)
            
            # Create mock transcript if we only have count
            if not words_list:
                transcript_text = " ".join(["word"] * total_words)
            else:
                transcript_text = transcript_input
            
            result = test.analyze_transcript(transcript_text, inserts)
            test.add_session(result)
            
            print(f"\n✅ Session added!")
            print(f"   Words: {result['total_words']}")
            print(f"   Inserts: {result['insert_count']}")
            print(f"   Frequency: {result['frequency_percent']}%")
            
        elif choice == '2':
            test.print_report()
            
        elif choice == '3':
            if len(test.sessions) < 3:
                print(f"\n⏳ Need at least 3 sessions. Currently have: {len(test.sessions)}")
            else:
                results = test.run_statistical_test()
                print(f"\n📊 Statistical Test Results:")
                print(f"   Chi-square: {results['chi_square']}")
                print(f"   p-value: {results['p_value']}")
                print(f"   Significant: {'YES' if results['significant'] else 'NO'}")
                print(f"\n   {results['interpretation']}")
                
        elif choice == '4':
            print("\n✅ Results saved. Goodbye!\n")
            break
        else:
            print("\n❌ Invalid choice. Try again.")


def main():
    parser = argparse.ArgumentParser(description='Test 1: Insert Frequency Analysis')
    parser.add_argument('--transcript', type=str, help='Path to transcript file')
    parser.add_argument('--inserts', type=str, help='Comma-separated list of insert words')
    parser.add_argument('--report', action='store_true', help='Print report from saved results')
    
    args = parser.parse_args()
    
    test = InsertFrequencyTest()
    test.load_results()
    
    if args.report:
        test.print_report()
    elif args.transcript and args.inserts:
        with open(args.transcript, 'r') as f:
            transcript_text = f.read()
        inserts_list = [i.strip() for i in args.inserts.split(',')]
        
        result = test.analyze_transcript(transcript_text, inserts_list)
        test.add_session(result)
        
        print(f"\n✅ Session analyzed and saved!")
        test.print_report()
    else:
        # Interactive mode
        interactive_mode()


if __name__ == '__main__':
    main()
