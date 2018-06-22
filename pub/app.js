const myapp = new Vue({
  el:'#app',
  data(){
    return{
      floors:[],
      qry:{
        bathtub:true,
        bidet:false,
        noantique:true,
        cityview:true,
        oceanview:true,
        newaircon:true,
        sellable:true,
        evfar:false,
        persons:'2',
        roomNo:''
      },
      disabledClass:'disabled'
    }
  },
  methods:{
    query(_option){
      console.log(_option)
    },
    searchRoom(){
      this.floors.forEach(elFloor=>{
        elFloor.forEach(elRoom=>{
          if(elRoom.ROOM === this.qry.roomNo){
            alert(`${elRoom.ROOM} 호 객실 정보\n객실 타입: ${elRoom.TYPE}\n베드: ${elRoom.BED}\n기타 사항: ${elRoom.PS}`)
            return ''
          }
        })
      })
      alert('찾는 객실이 없습니다.')
      return ''
    },
    infoRoom(floor,room){
      let elRoom = this.floors[floor][room]
      alert(`${elRoom.ROOM} 호 객실 정보\n객실 타입: ${elRoom.TYPE}\n베드: ${elRoom.BED}\n기타 사항: ${elRoom.PS}`)
    }
  },
  computed:{
    filteredFloors(){
      return this.floors.map(elFloor=>{
        return elFloor.map(elRoom=>{
          elRoom.disabled = false
          if(this.qry.bathtub && elRoom.PS.includes('욕조없음'))
            elRoom.disabled = true
          if(this.qry.bidet && !elRoom.PS.includes('비데'))
            elRoom.disabled = true
          if(this.qry.newaircon && elRoom.PS.includes('개별난방'))
            elRoom.disabled = true
          if(this.qry.noantique && elRoom.PS.includes('낡음'))
            elRoom.disabled = true
          if(this.qry.sellable && elRoom.PS.includes('판매불가'))
            elRoom.disabled = true
          if(this.qry.evfar && elRoom.PS.includes('EV'))
            elRoom.disabled = true
          if(!this.qry.cityview && elRoom.VIEW == 'CITY')
            elRoom.disabled = true
          if(!this.qry.oceanview && elRoom.VIEW == 'OCEAN')
            elRoom.disabled = true
          
          _persons = Math.floor(this.qry.persons)
          if(_persons >= 3 && (elRoom.BED == 'D' || elRoom.BED =='K'))
            elRoom.disabled = true
          if(_persons >= 4 && (elRoom.BED == 'DS'))
            elRoom.disabled = true

          return elRoom
        })
      })
    }
  },
  mounted(){
    const _this = this
    fetch('/pub/rooms.json')
    .then(_res=>_res.json())
    .then(function (_data){
      let floors = {}
      let floorShift = 0
      let floorShiftGear = 0
      _data.forEach(elRoom=>{
        let roomFloor = elRoom.ROOM.substr(0,1) + floorShift
        if(elRoom.PS.includes('끝방')) floorShiftGear += 1

        if(elRoom.VIEW == 'ANNEXUP') roomFloor = '10'
        if(elRoom.VIEW == 'ANNEXDOWN') roomFloor = '11'

        if(floorShiftGear == 2){
          floorShift += 1
          floorShiftGear = 0
        }

        if(!floors[roomFloor])
          floors[roomFloor] = []
        floors[roomFloor].unshift({...elRoom, disabled:false})
      })
      
      _this.floors = Object.values(floors).reverse()
    })
  }
})