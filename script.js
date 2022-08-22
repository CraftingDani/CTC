//-- variables --\\

const print = console.log
const $ = x => document.querySelector(x)
let running = false
let cookieTime = 1500
let cookieSpeed = 2
let width = 0
let highScore = localStorage.getItem("ctc.highScore")
const cookies = []



//-- startup --\\

registerSW()
updateBodySize()
$(".play").addEventListener("click", startGame)
$("#highScore").innerText = highScore



//-- functions --\\

async function registerSW()
{
    if("serviceWorker" in navigator)
    {
        try
        {
            await navigator.serviceWorker.register("./serviceWorker.js")
        }
        catch(e)
        {
            console.error("Could not register serviceWorker!", e)
        }
    }
}


function startGame()
{
    cookies.forEach(function(i)
    {
        i.delete()
    })

    $(".title").classList.add("hide")
    $(".game").classList.remove("hide")

    running = true
    spawnCookies()
}


function gameOver()
{
    running = false
    cookies.forEach(function(i)
    {
        i.delete()
    })

    $(".title").classList.remove("hide")
    $(".game").classList.add("hide")

    $("p.score").innerText = 0
    cookieSpeed = 2
    
    $("#highScore").innerText = highScore
}


function spawnCookies()
{
    const interval = setInterval(function()
    {
        if(!running) return clearInterval(interval) 

        const cookie = new Cookie()
        cookie.element.addEventListener("click", function()
        {
            cookie.click()
            setTimeout(function()
            {
                cookie.delete()
            }, 200)
        })

        cookieSpeed += 0.1

        print(cookieTime)
        print(cookieSpeed)

    }, cookieTime)
}


function updateBodySize()
{
    requestAnimationFrame(updateBodySize)

    cookies.forEach(function(i)
    {
        i.top += cookieSpeed
        i.element.style.top = i.top + "px"
        checkFail(i)
    })


    $("body").style.height = innerHeight + "px"

    if(innerWidth > innerHeight)
    {
        $("main").style.width = innerHeight + "px"
        width = innerHeight
        return
    }
    $("main").style.width = innerWidth + "px"
    width = innerWidth
}


function checkFail(cookie)
{
    if(cookie.top > innerHeight)
    {
        cookie.fail()
    }
}



function randInt(min, max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}



class Cookie
{
    constructor()
    {
        const cookieWidth = randInt(50, 80)
        this.element = document.createElement("div")
        $(".game").appendChild(this.element)
        this.element.classList.add("cookie")
        this.element.style.left = randInt(0, width - cookieWidth) + "px"
        this.element.style.width = cookieWidth + "px"
        this.top = 0
        this.special = randInt(0, 15) == 10
        if(this.special) this.element.classList.add("specialCookie")

        cookies.push(this)
    }

    updatePosition()
    {
        if(!running) return
        requestAnimationFrame(this.updatePosition)
        this.element.top += 2 + "px"
    }

    click()
    {
        this.element.style.scale = "0%"
        if(this.special) return this.incrementScore(2)
        this.incrementScore(1)
    }

    incrementScore(amount)
    {
        $("p.score").innerText = parseInt($("p.score").innerText) + amount

        if(parseInt($("p.score").innerText) >  highScore)  // highscore
        {
            highScore = parseInt($("p.score").innerText)
            localStorage.setItem("ctc.highScore", highScore)
        }
    }

    fail()
    {
        this.element.style.scale = "4000%"
        setTimeout(function()
        {
            gameOver()

        }, 200)
    }

    delete()
    {
        this.element.remove()
        delete cookies[cookies.indexOf(this)]
        delete this
    }
}
