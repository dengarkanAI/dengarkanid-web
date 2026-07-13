import re

with open("src/app/page.tsx", "r") as f:
    content = f.read()

# Add use client
content = '"use client";\nimport { useState } from "react";\n' + content

# Replace the manual FAQ toggle logic with React State
# I will just write a simple replacement or let the user do it.
# Wait, let's see how faq-item-new was structured.
# <div className="faq-item-new">
#     <div className="faq-question-new">...</div>
#     <div className="faq-answer-new" style={{display: 'none'}}>...</div>
# </div>

# Actually, I'll use regex to rewrite the FAQ structure if possible, but it's risky.
# Let's just add the exact useEffect from the original HTML to handle the Vanilla JS for now!
# This is a safe migration strategy.

vanilla_js = """
  import { useEffect } from "react";
  
  // Adding the vanilla JS logic inside a useEffect hook
  useEffect(() => {
    // FAQ Toggle
    const faqQuestions = document.querySelectorAll('.faq-question-new');
    faqQuestions.forEach(question => {
        // Remove existing listeners to prevent duplicates in strict mode
        const clone = question.cloneNode(true);
        question.parentNode.replaceChild(clone, question);
        
        clone.addEventListener('click', () => {
            const item = clone.parentElement;
            const isActive = item.classList.contains('active');
            
            document.querySelectorAll('.faq-item-new').forEach(faq => {
                faq.classList.remove('active');
                faq.querySelector('.faq-answer-new').style.display = 'none';
                faq.querySelector('.faq-toggle-icon').innerHTML = '&plus;';
            });
            
            if (!isActive) {
                item.classList.add('active');
                item.querySelector('.faq-answer-new').style.display = 'block';
                item.querySelector('.faq-toggle-icon').innerHTML = '&minus;';
            }
        });
    });

    // Pricing Toggle
    const toggleBtn = document.getElementById('billing-toggle');
    if (toggleBtn) {
        toggleBtn.addEventListener('change', (e) => {
            const isYearly = e.target.checked;
            document.querySelectorAll('.price-amount').forEach(price => {
                if (isYearly) {
                    price.innerText = price.getAttribute('data-yearly');
                } else {
                    price.innerText = price.getAttribute('data-monthly');
                }
            });
            document.querySelectorAll('.billing-period-text').forEach(period => {
                period.innerText = isYearly ? '/year' : '/month';
            });
        });
    }
  }, []);
"""

content = content.replace("export default function Home() {", "export default function Home() {\n" + vanilla_js)

with open("src/app/page.tsx", "w") as f:
    f.write(content)
