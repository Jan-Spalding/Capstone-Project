import nltk
nltk.download("punkt")
nltk.download("brown")
nltk.download("punkt_tab")

from nltk.corpus import brown
from nltk.util import bigrams
from nltk import word_tokenize

sen = "This is a test sentence. Going to be used for my bigram thingy. This is also a good day to test this on. I am happy to be here. You are so handsome. You are an anomaly. You are so beautiful. You are the bane of existance. You are very big. You are very open minded. You are part of a gang. You are going to the party."

token = nltk.word_tokenize(sen)

bigram = list(bigrams(token))

# bigram = list(bigrams(brown.words()))


# for x in bigram:
#     print(x)

#Using bigram to find probablity of a sentence

#Bigram | count
bigram_count = []

unique = False

for pair in bigram:
    unique = True
    for item in bigram_count:
        if pair == item[0]:
            unique = False
            item[1] += 1
            break
    if unique:
        bigram_count.append([pair, 1])

# TOTAL WORD COUNTS
count = []

unique = False

for word in bigram:
    unique = True
    for item in count:
        if word[0] == item[0]:
            unique = False
            item[1] += 1
            break
    if unique:
        count.append([word[0], 1])


print(bigram_count)

prob_sen = "This is a test sentence"

total_prob = 1

tokenized = nltk.word_tokenize(prob_sen)

print(tokenized)

def probability(word, context):
    prob = 0

    # P(context, word)
    for item in bigram_count:
        if context == item[0][0] and word == item[0][1]:
            prob = item[1]
            break

    # P(context, word)/ P(context)
    for item in count:
        if context == item[0]:
            return prob/item[1]


    return 0

# Prob of whole sentence
for num in range(1, len(tokenized)):
    word = tokenized[num]
    context = tokenized[num-1]
    total_prob *= probability(word, context)

print("Probability of this sentance: " + str(total_prob))
    
#Predict next word
predict_word = nltk.word_tokenize("I am")

def sort(array):
    n = len(array)
    if n > 2:
        for i in range(n-1):
            for j in range(n-i-1):
                if array[j][1] < array[j+1][1]:
                    array[j], array[j+1] = array[j+1], array[j]

        # print("sorted output")
        # print(array)
        return array
    else:
        return array
    

def predict(bigram):
    possibilities = []

    for item in bigram_count:
        if bigram[len(bigram) - 1] == item[0][0]:
            possibilities.append(item)

    copy = sort(possibilities)
    # print(copy)
    return copy


print("Predicted next word: " + predict(predict_word)[0][0][1])

# GENERATE 10 SENTENCES 

starting_word = nltk.word_tokenize("You are")

index = 0

generated_array = []

for sentence in range(0, 10):
    generated_sentence = starting_word[:]

    for word in range(0, 20):
        next_word = predict(generated_sentence)
        if word == 0:
            if index == len(next_word)-1:
                index = 0
            else:
                index += 1

            generated_sentence.append(next_word[index][0][1])
        else:
            generated_sentence.append(next_word[0][0][1])
        
        # print(next_word)

    
    print(generated_sentence)
    generated_array.append(generated_sentence)
    
# PROBABILITY OF ALL SENTENCES
for item in generated_array:
    prob = 1.0
    for num in range(1, len(item)):
        word = item[num]
        context = item[num-1]
        prob *= probability(word, context)
    
    print(item)
    print(prob)

# GOOGLE GEMINI

# from google import genai

# client = genai.Client(api_key= )
