import { shallowMount } from '@vue/test-utils'
import Countdown from '@/components/Countdown.vue'

describe('Countdown', () => {
  
  const wrapper = shallowMount(Countdown)
  
  it('renders a play button for the timer', () => {
  
    expect(wrapper.find('button').find('font-awesome-icon').attributes('icon')).toBe('play')
    
  })
  
  it('renders the default countdown time of 25 minutes', () => {
    
    expect(wrapper.text()).toBe('25')
    
  })
  
  it('renders a field for adjusting the pomodoro timer when the time is clicked', () => {
  
    expect(wrapper.find('#timerDisplay').isVisible()).toBe(true)
    expect(wrapper.find('#timerDisplay').text()).toBe('25')
    expect(wrapper.find('input[type="number"]').exists()).toBe(false)
  
    wrapper.find('#timerDisplay').trigger('click')
    
    expect(wrapper.find('#timerDisplay').exists()).toBe(false)
    expect(wrapper.find('input[type="number"]').isVisible()).toBe(true)
    expect(wrapper.find('input[type="number"]').element.value).toBe('25')
  })
  
})