# import nltk
# nltk.download('punkt')
# from nltk import word_tokenize


# mysent = "The cat sat on the mat"

# mysent_tokens = nltk.word_tokenize(mysent)

# print(mysent_tokens)


import nltk
nltk.download('brown')
nltk.download('punkt')

from nltk.corpus import brown
from nltk.util import bigrams

# print(brown.words())

bigram_list = list(bigrams(brown.words()))


for x in bigram_list:
    print(x)


generate_word = "I am"
token_word = nltk.word_tokenize(generate_word)