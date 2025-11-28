import nltk

# OPEN ARTICLES
file = open("article_one.txt")
article = ""

# file = open("article_two.txt")

# REMOVE PHARAGRAPH SPACES
for line in file:
    if line != "\n":
        article += line

article_sen = nltk.sent_tokenize(article)

# print(article_sen)

# REMOVE NON ALPHABET
for sen in range(len(article_sen)-1, -1, -1):
    for letter in range(len(article_sen[sen])-1, -1, -1):
        ascii_value = ord(article_sen[sen][letter])

        # a-z, A-Z, (new space)
        if ascii_value < 65 and ascii_value != 32 or ascii_value > 90 and ascii_value < 97 or ascii_value > 122:
            article_sen[sen] = article_sen[sen][:letter] + article_sen[sen][letter + 1:]
            letter -= 1

    if len(article_sen[sen]) == 0:
        article_sen.pop(sen)
    else:
        article_sen[sen] = article_sen[sen].lower()
            
# print(article_sen)


article_word = []  

for sen in article_sen:
    article_word += nltk.word_tokenize(sen)

# print(article_word)

unique_word = []
unique_frequency = []
highest_freq = 0
word_scores = []

for word in article_word:
    unique = True
    for word_index in range(0, len(unique_word)-1):
        if word == unique_word[word_index]:
            unique = False
            unique_frequency[word_index] += 1

            if unique_frequency[word_index] > highest_freq:
                highest_freq = unique_frequency[word_index]
            break
    if unique:
        unique_word.append(word)
        unique_frequency.append(1)

print(unique_word)
print(unique_frequency)
print(highest_freq)

for frequency in unique_frequency:
    word_scores.append(frequency/highest_freq)

print(word_scores)

file.close()