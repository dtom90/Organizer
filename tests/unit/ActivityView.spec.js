import { createLocalVue, shallowMount } from '@vue/test-utils'
import ActivityView from '@/components/ActivityView'
import ActivityChart from '@/components/ActivityChart'
import Log from '@/components/Log.vue'
import { FontAwesomeIcon } from '@/lib/font-awesome-icons'
import { taskWithActivity, generateActivity } from '../fixtures'
import moment from 'moment'
import Vuex from 'vuex'

const EXPECTED_DAY_KEY_FORMAT = 'YYYY-MM-DD'
const EXPECTED_DAY_DISPLAY_FORMAT = 'ddd MMM DD'

const task = taskWithActivity()
const { log, day1Duration, day2Duration, completedDate } = generateActivity()
const day1 = moment(completedDate).subtract(1, 'd')
const day2 = completedDate

const localVue = createLocalVue()
localVue.component('font-awesome-icon', FontAwesomeIcon)
localVue.use(Vuex)

let wrapper

const shouldBehaveLikeActivityView = function (type) {
  
  it('should have toggle buttons for weekly and daily activity', () => {
    const toggleButtons = wrapper.find('.btn-group')
    expect(toggleButtons.text()).toMatch('Daily Activity')
    expect(toggleButtons.text()).toMatch('Weekly Activity')
  })
  
  it('renders a chart of the activity in ascending daily order', () => {
    const activityChart = wrapper.find(ActivityChart)
    expect(activityChart.props('chartData')).toEqual({
      labels: [day1, day2].map(day => day.format(EXPECTED_DAY_DISPLAY_FORMAT)),
      datasets: [{
        label: wrapper.props('element'),
        backgroundColor: '#2020FF',
        data: [day1Duration, day2Duration].map(dur => dur / 60000)
      }]
    })
    
  })
  
  it('renders "Activity Log" display button', () => {
    
    const viewLogSwitch = wrapper.find('#viewLogSwitch')
    expect(viewLogSwitch.text()).toBe('Activity Log')
    
  })
  
  it('renders the daily task logs in descending chronological order when "Activity Log" clicked', async () => {
    
    expect(wrapper.vm.logVisible).toBe(false)
    
    const viewLogSwitch = wrapper.find('#viewLogSwitch')
    viewLogSwitch.trigger('click')
    expect(viewLogSwitch.classes()).toContain('active')
    
    expect(wrapper.vm.logVisible).toBe(true)
    
    const activityLogs = wrapper.findAll(Log)
    const day2log = [log[3], log[2]]
    if (type === 'task') {
      day2log.unshift({ completed: task.completed })
    }
    expect(activityLogs.at(0).props()).toEqual({
      log: day2log,
      day: day2.format(EXPECTED_DAY_KEY_FORMAT),
      timeSpent: day2Duration,
      deleteInterval: jest.fn()
    })
    expect(activityLogs.at(1).props()).toEqual({
      log: [log[1], log[0]],
      day: day1.format(EXPECTED_DAY_KEY_FORMAT),
      timeSpent: day1Duration,
      deleteInterval: jest.fn()
    })
    
  })
  
}

describe('ActivityView', () => {
  
  // add the 2 lines below
  let store
  
  describe('for task', () => {
    
    // add this before each
    beforeEach(() => {
      store = new Vuex.Store({
        state: {
          tasks: [task]
        }
      })
      
      wrapper = shallowMount(ActivityView, {
        propsData: { log: log, element: 'My Task', taskId: 1 },
        localVue,
        store
      })
    })
    
    shouldBehaveLikeActivityView('task')
    
    it('should calculate time spent even when an interval is running', () => {
      store = new Vuex.Store({
        state: {
          tasks: [{ id: 0 }]
        }
      })
      
      const startedTask = shallowMount(ActivityView, {
        propsData: {
          taskId: 0,
          log: [{ started: Date.now(), stopped: null }],
          element: 'My Task'
        },
        localVue,
        store
      })
      expect(startedTask.vm.calculateTimeSpent(startedTask.vm.log)).toEqual(moment.duration(0).asMilliseconds())
    })
    
  })
  
  describe('for tag', () => {
    
    // add this before each
    beforeEach(() => {
      wrapper = shallowMount(ActivityView, {
        propsData: { log: log, element: 'myTag' },
        localVue,
        store: new Vuex.Store({
          state: {
            tags: { myTag: {} }
          }
        })
      })
    })
    
    shouldBehaveLikeActivityView('tag')
    
  })
  
})
