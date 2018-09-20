
# Kr-Cls-Keras #

----------

A LSTM Korean sentence classifier that can classify a sentence into six diffrent categories.

["You can try it here !"](https://hyunr.github.io/kr-cls-keras/ "https://hyunr.github.io/kr-cls-keras/")

## Model Structure ##
| Layer| Output Shape | Param # |
| ------------- | ------------- | ------------- |
| Embedding  | (None, 83, 64)  | 3200000 |
| Bidirentional LSTM  | (None, 83, 256)  | 197632|
| LSTM | (None, 128) | 197120 |
| Dense with 0.5 droup out | (None, 128) | 16512 |
| Dense with 0.5 droup out | (None, 128) | 16512 |
| Dense with 0.5 softmax | (None, 6) | 774 |

Trainable params: 3,628,550

Non-trainable params: 0

Trained on GTX1060 (6gb) with i7-7700HQ for 6hrs.

## Result ##

> With 1000 new samples

| Category| value |
| ------------- | ------------- |
| Validation loss |2.2124|
|Validation accuracy|0.6842|
|computer|80.124 %|
|consultation accuract|66.467 %|
|small talk|43.429 %|
|gaming| 71.069%|
|subculture|75.000%|
|politics|73.684%|

Total : 68.000%


## Data ##
The final model has been trained with total 523800 sentences are evenly collected from diffrent categories from [dogdrip.net](https://www.dogdrip.net/)

- Computer

- Consultation

- Gaming

- Politics

- Subculture

- Small Talk

87300 sentences from each   

## Trial and Errors ##
### First Try ###
At first, I tried to build a small model with small number of data and categories to figure out what I could do.

I collected 56800 sentences between 2 diffrent categories and trained my simple LSTM model with few dence layers model.

The result was good enough. It could acheive around 80% accuracy with its test set. So I decided to go with more data.


### Second Try ###
For this time, I wanted to build a bigger model that can handle more data and categories. So I collected 360000 senteces from 6 diffrenet categories. And stack bidirectional LSTM RNN with unidirectional LSTM.
Also added 5 dence layers to it for deeper model.

Howerver the result was not satisfying at all. 

![](https://cdn.discordapp.com/attachments/417472445969203202/492411659260919840/2nd_try.PNG)

![](https://cdn.discordapp.com/attachments/417472445969203202/492412611644751893/2nd_try_los.PNG)

> Accuracy and loss with 0.2 test set and 0.05 valid set split.	
 
I tweaked and tuned number of hidden layers, add/remove drop out and layers but the result was not so great compare to what I expected. Even worse, all of the model does over fitting, So I needed to find a way to fix it and came with 3 ideas.

1. Collect more data.

	I believe it is always nice to have as many data as possible.
	So I decided to collect more data from 360000 senteces to 523800 senteces (around 46% more data)

2. Process data wisely.
	
	I used Kearas' basic tokenizer to tokenize my data. And what it does is break a given string by space into words and choose top k frequency words to tokenize. The problem was due to the different grammer structure of Korean language, it was not a good way to tokenize. The most significant problem was spacing. In Korean language, the importance of spacing is less than English language. Most of Korean speakers will not have any big problem with reading non-spacing sentence and it does appear on my data set too.
	
	I found [a great Korean language tokenizer](https://github.com/open-korean-text/open-korean-text) that is really good at analyzing but, I realize that my model should able to understand any given sentence as an union of many characters. So I decided to comeback Keras' tokenizer with character tokenize feature.

### Final model ###

![](https://cdn.discordapp.com/attachments/417472445969203202/492418675870269451/final_model.PNG)
![](https://cdn.discordapp.com/attachments/417472445969203202/492418688700514355/final_loss.PNG)
> Accuracy and loss with 0.2 test set and 0.05 valid set split.	

The first red graph represents my original char-size-tokenize model.
It was big and heavy, so the trained model.h5 file has about 70MB.
And it was way to big to upload on github and setup the github page for demo.

So I reduced my model's size by decreasing number of hidden layers to reasonable amount so it can keep its accuracy.

The green graph is my final trained model. It could achieve about the same accuracy and loss as previous model has with half the training time and with 1/3 of the size !
