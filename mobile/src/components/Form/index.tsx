import React, { useState } from 'react'
import { 
  View,
  TextInput,
  Image,
  Text,
  TouchableOpacity
} from 'react-native'
import { captureScreen } from 'react-native-view-shot'
import { ArrowLeft } from 'phosphor-react-native'
import * as FileSystem from 'expo-file-system'

import { FeedbackType } from '../Widget'
import { ScreenshotButton } from '../ScreenshotButton'
import { Button } from '../Button'

import { feedbackTypes } from '../../utils/feedbackTypes'
import { theme } from '../../theme'
import { api } from '../../libs/api'
import { styles } from './styles'

interface Props {
  feedbackType: FeedbackType
  onFeedbackCanceled: () => void
  onFeedbackSent: () => void
}

export const Form = ({ feedbackType, onFeedbackCanceled, onFeedbackSent }: Props) => {
  const [screenshot, setScreenshot] = useState<string | null>(null)
  const [comment, setComment] = useState('')
  const [isSendingFeedback, setIsSendingFeedback] = useState(false)

  const feedbackTypeInfo = feedbackTypes[feedbackType]
  
  const handleScreenshot = () => {
    captureScreen({
      format: 'jpg',
      quality: 0.8,
    })
      .then((uri) => setScreenshot(uri))
      .catch((err) => console.log(err));
  }

  const handleSendFeedback = async () => {
    try {
      setIsSendingFeedback(true)
    
      const screenshotBase64 = screenshot && 
        await FileSystem.readAsStringAsync(screenshot, { encoding: 'base64' })

      await api.post('/feedbacks', {
        type: feedbackType,
        screenshot: `data:image/png;base64, ${screenshotBase64}`,
        comment
      })

      onFeedbackSent()
    } catch (error) {
      console.log(error)
    } finally {
      setIsSendingFeedback(false)
    }
  }

  const handleScreenshotRemove = () => {
    setScreenshot(null)
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onFeedbackCanceled}>
          <ArrowLeft 
            size={24} 
            weight="bold" 
            color={theme.colors.text_secondary}  
          />          
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Image 
            source={feedbackTypeInfo.image} 
            style={styles.image}
          />

          <Text style={styles.titleText}>
            {feedbackTypeInfo.title}
          </Text>
        </View>
      </View>

      <TextInput
        multiline
        style={styles.input}
        placeholder="Algo não está funcionando bem? Queremos corrigir. Conte com detalhes o que está acontecendo..."
        placeholderTextColor={theme.colors.text_secondary}
        autoCorrect={false}
        onChangeText={setComment}
      />

      <View style={styles.footer}>
        <ScreenshotButton 
          screenshot={screenshot}
          onTakeShot={handleScreenshot}
          onRemoveShot={handleScreenshotRemove}
        />

        <Button 
          onPress={handleSendFeedback}
          isLoading={isSendingFeedback}
        />
      </View>
    </View>
  )
}