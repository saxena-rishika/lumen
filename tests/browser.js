(async()=>{
 const results=[];
 const assert=(name,value)=>{results.push({name,passed:!!value});if(!value)throw Error(name)};
 try {
  const memory={};store.get=(key,fallback)=>memory[key]??fallback;store.set=(key,value)=>{memory[key]=JSON.parse(JSON.stringify(value))};state.social=[];state.nutrition=[];state.attempts=[];state.onboarded=true;state.checked=false;state.tab='home';render();
  assert('Greeting uses Rishika',document.body.textContent.includes('Hello, Rishika'));
  const suggestions=new Set();
  for(const [,need] of needs){state.need=need;render();suggestions.add($('.soft-landing').textContent);assert(need+' has matching recommendations',$$('.soft-landing [data-activity]').every(b=>activities.find(a=>a.id===b.dataset.activity).category===need));}
  assert('All six needs have different suggestions',suggestions.size===6);
  const first=$('.soft-landing').textContent;action('another');assert('Another rotates suggestions',first!==$('.soft-landing').textContent);
  state.need=null;render();const inputs=$$('.sliders input');inputs[0].value=65;state.weather='Light';action('checkin');assert('Check-in saves selected weather and slider',check.weather==='Light'&&check.energy===65);
  for(const category of ['Comfort','Calm','Energy','Connection','Clarity','Distraction','Rest','A little kindness']){state.reset.need=category;state.reset.time='2 min';state.reset.place='Work/study';resetResult();assert(category+' reset matches available duration and location',activeReset.category===category&&activeReset.min<=2&&(activeReset.places.includes('Anywhere')||activeReset.places.includes('Work/study')));closeModal();}
  state.reset.time='20 min';resetResult();$('#start-timer').click();assert('Timer reflects selected duration',$('#countdown').textContent==='20:00');$('#finish').click();$('[data-feedback="2"]').click();assert('Feedback saved to history',state.attempts.at(-1).result===2);
  editor(true);const initial=state.entries.length;$('#save-entry').click();assert('Empty photo dump is not saved',state.entries.length===initial);
  const c=document.createElement('canvas');c.width=40;c.height=40;c.getContext('2d').fillRect(0,0,40,40);const blob=await new Promise(r=>c.toBlob(r));
  await uploadPhotos({target:{files:[new File([blob],'test.png',{type:'image/png'})],value:''}});assert('Uploaded photo has a real image preview',$('#photo-preview img')?.src.startsWith('data:image/jpeg'));
  $('#entry-text').value='<script>unsafe</script> A day worth keeping';stickerPicker();$('[data-sticker="🌼"]').click();assert('Sticker adds to page',draft.stickers.includes('🌼'));
  doodleTool();const cv=$('#drawing');cv.setPointerCapture=()=>{};cv.dispatchEvent(new PointerEvent('pointerdown',{pointerId:1,clientX:20,clientY:20}));cv.dispatchEvent(new PointerEvent('pointermove',{pointerId:1,clientX:70,clientY:50}));cv.dispatchEvent(new PointerEvent('pointerup',{pointerId:1}));assert('Doodle is a saved bitmap',draft.doodle?.startsWith('data:image/png'));
  songPicker();$('[data-song]').click();assert('Song tool adds Spotify embed',$('#song-preview iframe')?.src.includes('open.spotify.com/embed/track'));
  $('#save-entry').click();assert('Photo, stickers, doodle, and song persist together',store.get('entries',[])[0].photos.length===1&&store.get('entries',[])[0].stickers.length===1&&store.get('entries',[])[0].doodle&&store.get('entries',[])[0].songData.id);
  assert('Saved image displays in journal',!!$('.saved-photo'));assert('Entry text is escaped',!$('.entry script')&&$('.entry').textContent.includes('<script>unsafe</script>'));$('.song-tag').click();assert('Saved song opens player',!!$('.spotify-player'));closeModal();
  state.tab='me';render();$('[data-action="social"]').click();assert('Social rhythm opens',!!$('#save-social'));$('#social-person').value='Friend';$('#save-social').click();assert('Social log persists',store.get('social',[]).length===1);closeModal();
  $('[data-action="nutrition"]').click();assert('Mental nutrition opens',!!$('#save-nutrition'));$('#nutrition-type').value='Play';$('#save-nutrition').click();assert('Nutrition log persists',store.get('nutrition',[])[0].category==='Play');closeModal();
  game('bubbles');$('.bubble').click();assert('Bubble game responds',$('.bubble').disabled&&$('.bubble').classList.contains('popped'));closeModal();game('match');$('.match-card').click();assert('Matching game reveals cards',$('.match-card').classList.contains('flipped'));closeModal();game('breath');assert('Breathing exercise opens',!!$('.breathing-circle'));closeModal();
  assert('Spotify links validated',!!spotifyId('https://open.spotify.com/track/3xKsf9qdS1CyvXSMEid6g8?si=123')&&!spotifyId('javascript:alert(1)'));
  assert('Profile uses Rishika',!$('#app').textContent.includes('Yuvraj')&&$('#app').textContent.includes('Rishika'));
  state.tab='home';state.need='Distraction';render();assert('App fits mobile width',$('#app').scrollWidth<=$('#app').clientWidth);
 }catch(error){results.push({error:error.stack})}
 const report=document.createElement('pre');report.id='test-results';report.style.cssText='white-space:pre-wrap;overflow-wrap:anywhere;width:100%;font-size:12px';report.textContent=JSON.stringify(results,null,2);document.body.appendChild(report);document.title=results.some(x=>x.passed===false||x.error)?'TESTS FAILED':'TESTS PASSED';
})();
