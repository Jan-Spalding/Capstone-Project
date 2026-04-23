import nltk
import requests
from bs4 import BeautifulSoup as bs
import matplotlib.pyplot as plt

article = ""

# REQUEST HTML
while True:
    url = input("Enter the URL of news article: ")

    try:
        request = requests.get(url)

        if request.status_code == 200:

            html = bs(request.text, "html.parser")
            for p in html.find_all("p"):
                article += p.text

            break
        else:
            print("Couldn't connect to URL")
    except:
        print("Invalid URL")




# OPEN ARTICLES
# file = open("article_one.txt")
# file = open("article_two.txt")
# file = open("article_three.txt")


# REMOVE PHARAGRAPH SPACES
# for line in file:
#     if line != "\n":
#         article += line

article_sen = nltk.sent_tokenize(article)

# USED FOR GENERATION
sorted_sen = article_sen[:] #COPY WITHOUT REFFERENCE

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

unique_word = []
unique_frequency = []
highest_freq = 0


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

# print(unique_word)
# print(unique_frequency)
# print(highest_freq)


# n = len(unique_frequency)
# for i in range(n-1):
#   for j in range(n-i-1):
#     if unique_frequency[j] > unique_frequency[j+1]:
#       unique_frequency[j], unique_frequency[j + 1] = unique_frequency[j + 1], unique_frequency[j]
#       unique_word[j], unique_word[j + 1] = unique_word[j + 1], unique_word[j]

# print(unique_word)
# print(unique_frequency)

# no_points = 30

# x = []
# y = []

# for num in range(0, no_points):
#     x.append(unique_word[len(unique_word)-1 - num])
#     y.append(unique_frequency[len(unique_frequency)-1 - num])

# print(x)
# print(y)

# plt.bar(x, y)
# plt.xticks(rotation=90)
# plt.show()

word_scores = []

for frequency in unique_frequency:
    word_scores.append(frequency/highest_freq)

sen_scores = []

for sen_index in range(0, len(article_sen)-1):
    sen_scores.append(0)
    for word in article_sen[sen_index]:
        for word_index in range(0, len(unique_word)-1):
            if word == unique_word[word_index]:
                sen_scores[sen_index] += word_scores[word_index]
                break

# GENERATE SUMMARY

# BUBBLE SORT: https://www.w3schools.com/python/python_dsa_bubblesort.asp
n = len(sen_scores)
for i in range(n-1):
  for j in range(n-i-1):
    if sen_scores[j] > sen_scores[j+1]:
      sen_scores[j], sen_scores[j + 1] = sen_scores[j + 1], sen_scores[j]
      sorted_sen[j], sorted_sen[j + 1] = sorted_sen[j + 1], sorted_sen[j]

# SHOW HIGHEST RATED SENTENCES
no_sen = 10

for index in range(len(sorted_sen)-1, len(sorted_sen)- no_sen -1, -1):
    print(sorted_sen[index])
    print("")

# file.close()