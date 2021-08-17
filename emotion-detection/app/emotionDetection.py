from fer import FER
import matplotlib.pyplot as plt
import matplotlib.patches as patches


def getEmotion(file):
    detector = FER(mtcnn=True)
    img = plt.imread(file)
    result = detector.detect_emotions(img)
    if result:
        emotion, score = _getTopEmotion(result)
        return [emotion, score]
    else:
        return []


def _getTopEmotion(result):
    return sorted(list(result[0]["emotions"].items()), key=lambda x: x[1])[-1]
