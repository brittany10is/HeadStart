const cafeList = document.querySelector('#cafe-list');
const form = document.querySelector('#add-run-form');

const totalMiles = document.querySelector('#totalMiles');
const totalTime = document.querySelector('#totalTime');

const threeMiles = document.querySelector('#threeMiles');
const fiveMiles = document.querySelector('#fiveMiles');

const win = document.querySelector('#win');


let TotalMiles = 0;
let TotalTime = 0;
// create element & render cafe
function renderCafe(doc) {
    let li = document.createElement('li');
    let name = document.createElement('span');
    let city = document.createElement('span');
    let cross = document.createElement('div');

    li.setAttribute('data-id', doc.id);
    name.textContent = doc.data().name + " miles";
    city.textContent = doc.data().city + " minutes";
    cross.textContent = 'x';

    li.appendChild(name);
    li.appendChild(city);
    li.appendChild(cross);

    cafeList.appendChild(li);

    // deleting data
    cross.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('cafes').doc(id).delete();
    });
}


// getting data
// db.collection('cafes').orderBy('city').get().then(snapshot => {
//     snapshot.docs.forEach(doc => {
//         renderCafe(doc);
//     });
// });

// saving data
form.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('cafes').add({
        name: form.name.value,
        city: form.city.value
    });
    form.name.value = '';
    form.city.value = '';
});


function updateStats() {
    TotalMiles = 0;
    TotalTime = 0;

    db.collection('cafes').get().then((snapshot) => {
        snapshot.docs.forEach(doc => {
            TotalMiles += Number(doc.data().name);

            totalMiles.innerText = TotalMiles

            TotalTime += Number(doc.data().city);
            totalTime.innerText = TotalTime

        })
    })
}

function updateAchievements(){
    TotalMiles = 0;
    TotalTime = 0;

    db.collection('cafes').get().then((snapshot) => {
        snapshot.docs.forEach(doc => {
            TotalMiles += Number(doc.data().name);
            TotalTime += Number(doc.data().city);

            if (TotalMiles/2 >= 3){
                threeMiles.innerText = "woohoo";
            }        
            console.log(TotalMiles);

            if (TotalMiles/2 >= 5){
                fiveMiles.innerText = "woohoo";
            }      
        })
    })
}

function updateChallenge(){
    TotalMiles = 0;
    TotalTime = 0;



    db.collection('cafes').get().then((snapshot) => {
        snapshot.docs.forEach(doc => {
            TotalMiles += Number(doc.data().name);
            TotalTime += Number(doc.data().city);

            if (TotalMiles/2 >= 3){
                if (TotalTime/2 >=30){
                    win.innerText = "They lost";

                }
            }        
    
        })
    })
}

// real-time listener
db.collection('cafes').orderBy('city').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        //console.log(change.doc.data());
        if (change.type == 'added') {
            renderCafe(change.doc);
        } else if (change.type == 'removed') {
            let li = cafeList.querySelector('[data-id=' + change.doc.id + ']');
            cafeList.removeChild(li);
        }

    });

    updateStats();
    updateAchievements();
    updateChallenge();    

});
