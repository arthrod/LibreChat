#!/bin/bash

echo "=== Directory Comparison Log ===" > comparison_log.txt
echo "Generated at: $(date)" >> comparison_log.txt
echo "" >> comparison_log.txt

echo "=== Files in original_client ===" >> comparison_log.txt
find ./original_client -type f | sort >> comparison_log.txt

echo "" >> comparison_log.txt
echo "=== Files in current client ===" >> comparison_log.txt
find ./client -type f | sort >> comparison_log.txt

echo "" >> comparison_log.txt
echo "=== File content differences ===" >> comparison_log.txt

# Compare common files
for file in $(find ./client -type f); do
    rel_path=${file#./client/}
    if [ -f "./original_client/$rel_path" ]; then
        echo "Comparing $rel_path..." >> comparison_log.txt
        diff -u "./original_client/$rel_path" "$file" >> comparison_log.txt 2>&1
        echo "" >> comparison_log.txt
    fi
done

echo "Comparison log has been created in comparison_log.txt"
