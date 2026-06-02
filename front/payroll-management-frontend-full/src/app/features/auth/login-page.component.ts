import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="auth-page">
      <div class="auth-shell">
        <section class="left-panel">
          <div class="left-glow glow-1"></div>
          <div class="left-glow glow-2"></div>

          <div class="left-content">
            <div class="brand-block">
              <div class="logo-box">
                <img src="assets/logo.png" alt="Logo" class="brand-logo" />
              </div>

              <div class="brand-copy">
                <span class="brand-chip">MEDISYS CONSULTING</span>
                <h1>Plateforme de gestion RH et de paie</h1>
              </div>
            </div>

            <div class="image-slider">
              <div class="slider-frame">
                <div
                  class="slide"
                  *ngFor="let slide of slides; let i = index"
                  [class.active]="i === currentSlide"
                  [style.background-image]="'linear-gradient(180deg, rgba(0,0,0,.15), rgba(0,0,0,.68)), url(' + slide.image + ')'"
                >
                  <div class="slide-content">
                    <span class="slide-tag">{{ slide.tag }}</span>
                    <h3>{{ slide.title }}</h3>
                    <p>{{ slide.text }}</p>
                  </div>
                </div>
              </div>

              <div class="slider-controls">
                <button type="button" class="nav-btn" (click)="prevSlide()">‹</button>

                <div class="slider-dots">
                  <button
                    type="button"
                    class="dot"
                    *ngFor="let slide of slides; let i = index"
                    [class.active]="i === currentSlide"
                    (click)="goToSlide(i)"
                  ></button>
                </div>

                <button type="button" class="nav-btn" (click)="nextSlide()">›</button>
              </div>
            </div>

            <div class="bottom-badges">
              <span>Élégance</span>
              <span>Sécurité</span>
              <span>Fiabilité</span>
              <span>Excellence</span>
            </div>
          </div>
        </section>

        <section class="right-panel">
          <div class="form-card">
            <div class="form-header">
              <span class="form-chip">ESPACE SÉCURISÉ</span>
              <h2>Connexion</h2>
              <p>Accédez à votre espace professionnel de gestion.</p>
            </div>

            <div *ngIf="errorMessage" class="alert alert-error">
              {{ errorMessage }}
            </div>

            <form [formGroup]="form" (ngSubmit)="submit()" class="login-form">
              <div class="field">
                <label for="email">Adresse e-mail</label>
                <div class="input-shell">
                  <span class="input-icon">✦</span>
                  <input
                    id="email"
                    type="email"
                    formControlName="email"
                    placeholder="admin@payroll.com"
                    autocomplete="email"
                  />
                </div>
                <small class="field-error" *ngIf="form.controls.email.touched && form.controls.email.invalid">
                  Veuillez saisir une adresse e-mail valide.
                </small>
              </div>

              <div class="field">
                <label for="password">Mot de passe</label>
                <div class="input-shell">
                  <span class="input-icon">●</span>
                  <input
                    id="password"
                    type="password"
                    formControlName="password"
                    placeholder="Admin123!"
                    autocomplete="current-password"
                  />
                </div>
                <small class="field-error" *ngIf="form.controls.password.touched && form.controls.password.invalid">
                  Le mot de passe est obligatoire.
                </small>
              </div>

              <button class="btn-login" type="submit" [disabled]="form.invalid || loading">
                <span class="btn-shine"></span>
                <span class="btn-text" *ngIf="!loading">Se connecter</span>
                <span class="btn-text" *ngIf="loading">Connexion en cours...</span>
              </button>
            </form>

            <div class="divider"></div>

            <div class="secure-box">
              <div class="secure-dot"></div>
              <div>
                <strong>Connexion sécurisée</strong>
                <p>Réservée aux utilisateurs autorisés de la plateforme.</p>
              </div>
            </div>

            <div class="contact-grid">
              <div class="contact-card">
                <span class="contact-label">Email</span>
                <span class="contact-value">info&#64;medisys-consulting.com</span>
              </div>

              <div class="contact-card">
                <span class="contact-label">Téléphone</span>
                <span class="contact-value">+216 71 906 170</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      font-family: Inter, "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
      color: #f8fafc;
    }

    * {
      box-sizing: border-box;
    }

    .auth-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      background:
        radial-gradient(circle at 20% 15%, rgba(212, 175, 55, 0.10), transparent 26%),
        radial-gradient(circle at 80% 85%, rgba(245, 208, 92, 0.08), transparent 28%),
        linear-gradient(135deg, #050505 0%, #0b0b0b 40%, #141414 100%);
    }

    .auth-shell {
      width: 100%;
      max-width: 1380px;
      min-height: 780px;
      display: grid;
      grid-template-columns: 1.2fr 470px;
      border-radius: 34px;
      overflow: hidden;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(212, 175, 55, 0.16);
      box-shadow:
        0 28px 80px rgba(0, 0, 0, 0.55),
        0 10px 30px rgba(0, 0, 0, 0.40);
      backdrop-filter: blur(16px);
    }

    .left-panel {
      position: relative;
      overflow: hidden;
      background:
        linear-gradient(165deg, rgba(12,12,12,0.96), rgba(28,28,28,0.94)),
        linear-gradient(180deg, #0a0a0a, #121212);
    }

    .left-glow {
      position: absolute;
      border-radius: 50%;
      filter: blur(20px);
      pointer-events: none;
      opacity: 0.30;
      animation: glowFloat 8s ease-in-out infinite;
    }

    .glow-1 {
      width: 260px;
      height: 260px;
      top: -60px;
      left: -50px;
      background: radial-gradient(circle, rgba(212, 175, 55, 0.50), transparent 70%);
    }

    .glow-2 {
      width: 320px;
      height: 320px;
      right: -90px;
      bottom: -80px;
      background: radial-gradient(circle, rgba(245, 208, 92, 0.35), transparent 70%);
      animation-delay: 2s;
    }

    .left-content {
      position: relative;
      z-index: 1;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 56px;
    }

    .brand-block {
      display: flex;
      flex-direction: column;
      gap: 28px;
    }

    .logo-box {
      width: 154px;
      height: 154px;
      border-radius: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(145deg, rgba(212,175,55,0.10), rgba(255,255,255,0.03));
      border: 1px solid rgba(212, 175, 55, 0.22);
      box-shadow:
        0 20px 40px rgba(0,0,0,0.28),
        inset 0 1px 0 rgba(255,255,255,0.04);
      animation: logoPulse 4s ease-in-out infinite;
    }

    .brand-logo {
      width: 112px;
      height: 112px;
      object-fit: contain;
      animation: logoFloat 5s ease-in-out infinite;
    }

    .brand-chip {
      display: inline-flex;
      width: fit-content;
      padding: 8px 14px;
      margin-bottom: 18px;
      border-radius: 999px;
      background: rgba(212, 175, 55, 0.10);
      border: 1px solid rgba(212, 175, 55, 0.18);
      color: #f8e7a1;
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 1px;
    }

    .brand-copy h1 {
      margin: 0 0 18px;
      max-width: 720px;
      font-size: 44px;
      line-height: 1.12;
      font-weight: 800;
      color: #fff9e8;
    }

    .image-slider {
      margin-top: 34px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .slider-frame {
      position: relative;
      height: 360px;
      border-radius: 26px;
      overflow: hidden;
      border: 1px solid rgba(212, 175, 55, 0.15);
      box-shadow: 0 18px 40px rgba(0,0,0,0.22);
    }

    .slide {
      position: absolute;
      inset: 0;
      opacity: 0;
      transition: opacity 0.9s ease;
      background-size: cover;
      background-position: center;
      display: flex;
      align-items: flex-end;
      padding: 26px;
    }

    .slide.active {
      opacity: 1;
      z-index: 1;
    }

    .slide-content {
      width: 100%;
      max-width: 520px;
      padding: 18px 20px;
      border-radius: 20px;
      background: rgba(0, 0, 0, 0.34);
      border: 1px solid rgba(255,255,255,0.10);
      backdrop-filter: blur(10px);
    }

    .slide-tag {
      display: inline-flex;
      margin-bottom: 10px;
      padding: 7px 12px;
      border-radius: 999px;
      background: rgba(212,175,55,0.16);
      border: 1px solid rgba(212,175,55,0.22);
      color: #f8e7a1;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.4px;
    }

    .slide-content h3 {
      margin: 0 0 8px;
      font-size: 26px;
      font-weight: 800;
      color: #fff8e7;
    }

    .slide-content p {
      margin: 0;
      color: rgba(255,255,255,0.84);
      font-size: 14px;
      line-height: 1.7;
    }

    .slider-controls {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    .nav-btn {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      border: 1px solid rgba(212,175,55,0.18);
      background: rgba(255,255,255,0.05);
      color: #f8e7a1;
      font-size: 24px;
      cursor: pointer;
      transition: 0.25s ease;
    }

    .nav-btn:hover {
      background: rgba(212,175,55,0.12);
      transform: translateY(-1px);
    }

    .slider-dots {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 10px;
      flex: 1;
    }

    .dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      border: none;
      cursor: pointer;
      background: rgba(255,255,255,0.22);
      transition: transform 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;
    }

    .dot.active {
      background: #d4af37;
      transform: scale(1.15);
      box-shadow: 0 0 0 5px rgba(212,175,55,0.12);
    }

    .bottom-badges {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 28px;
    }

    .bottom-badges span {
      padding: 10px 14px;
      border-radius: 999px;
      background: rgba(212, 175, 55, 0.08);
      border: 1px solid rgba(212, 175, 55, 0.14);
      color: #f7e7aa;
      font-size: 13px;
      font-weight: 600;
    }

    .right-panel {
      background: linear-gradient(180deg, #111111, #181818);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 34px;
    }

    .form-card {
      width: 100%;
      max-width: 400px;
      padding: 34px;
      border-radius: 28px;
      background: linear-gradient(180deg, rgba(24,24,24,0.96), rgba(14,14,14,0.96));
      border: 1px solid rgba(212, 175, 55, 0.18);
      box-shadow:
        0 20px 44px rgba(0, 0, 0, 0.32),
        inset 0 1px 0 rgba(255,255,255,0.03);
    }

    .form-header {
      margin-bottom: 28px;
    }

    .form-chip {
      display: inline-flex;
      margin-bottom: 14px;
      padding: 7px 12px;
      border-radius: 999px;
      background: rgba(212, 175, 55, 0.10);
      border: 1px solid rgba(212, 175, 55, 0.16);
      color: #f8e7a1;
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 0.4px;
    }

    .form-header h2 {
      margin: 0 0 8px;
      font-size: 32px;
      font-weight: 800;
      color: #fff8e7;
    }

    .form-header p {
      margin: 0;
      color: rgba(255,255,255,0.62);
      font-size: 14px;
      line-height: 1.7;
    }

    .alert {
      margin-bottom: 18px;
      padding: 13px 14px;
      border-radius: 14px;
      font-size: 14px;
    }

    .alert-error {
      background: rgba(127, 29, 29, 0.28);
      color: #fecaca;
      border: 1px solid rgba(248, 113, 113, 0.28);
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .field label {
      font-size: 14px;
      font-weight: 700;
      color: #f8e7a1;
    }

    .input-shell {
      position: relative;
      display: flex;
      align-items: center;
    }

    .input-icon {
      position: absolute;
      left: 15px;
      color: rgba(245, 222, 130, 0.72);
      font-size: 14px;
      width: 20px;
      text-align: center;
      pointer-events: none;
    }

    .field input {
      width: 100%;
      height: 56px;
      padding: 0 16px 0 44px;
      border-radius: 16px;
      border: 1px solid rgba(212, 175, 55, 0.16);
      background: #141414;
      font-size: 15px;
      color: #fff9e8;
      outline: none;
      transition: all 0.25s ease;
    }

    .field input::placeholder {
      color: rgba(255,255,255,0.34);
    }

    .field input:focus {
      border-color: rgba(212, 175, 55, 0.48);
      box-shadow: 0 0 0 4px rgba(212, 175, 55, 0.10);
      background: #181818;
    }

    .field-error {
      font-size: 12px;
      color: #fca5a5;
      margin-top: 2px;
    }

    .btn-login {
      position: relative;
      overflow: hidden;
      margin-top: 6px;
      height: 56px;
      border: none;
      border-radius: 16px;
      background: linear-gradient(135deg, #b8892d, #d4af37, #f2d06b);
      color: #111111;
      font-size: 15px;
      font-weight: 800;
      cursor: pointer;
      transition: all 0.25s ease;
      box-shadow: 0 14px 28px rgba(212, 175, 55, 0.20);
    }

    .btn-login:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 18px 32px rgba(212, 175, 55, 0.24);
    }

    .btn-login:disabled {
      opacity: 0.72;
      cursor: not-allowed;
      box-shadow: none;
      transform: none;
    }

    .btn-text {
      position: relative;
      z-index: 2;
    }

    .btn-shine {
      position: absolute;
      top: 0;
      left: -120%;
      width: 60%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255,255,255,0.35),
        transparent
      );
      transform: skewX(-20deg);
      animation: shineMove 3.2s ease-in-out infinite;
      z-index: 1;
    }

    .divider {
      height: 1px;
      background: rgba(212, 175, 55, 0.12);
      margin: 22px 0 18px;
    }

    .secure-box {
      display: flex;
      gap: 12px;
      align-items: flex-start;
      padding: 16px;
      border-radius: 18px;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(212, 175, 55, 0.12);
    }

    .secure-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #d4af37;
      box-shadow: 0 0 0 5px rgba(212, 175, 55, 0.10);
      flex-shrink: 0;
      margin-top: 4px;
    }

    .secure-box strong {
      display: block;
      margin-bottom: 4px;
      color: #fff3c4;
      font-size: 14px;
    }

    .secure-box p {
      margin: 0;
      color: rgba(255,255,255,0.64);
      font-size: 13px;
      line-height: 1.6;
    }

    .contact-grid {
      display: grid;
      gap: 12px;
      margin-top: 18px;
    }

    .contact-card {
      padding: 14px 16px;
      border-radius: 16px;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(212, 175, 55, 0.10);
    }

    .contact-label {
      display: block;
      margin-bottom: 5px;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: rgba(245, 222, 130, 0.62);
    }

    .contact-value {
      font-size: 14px;
      font-weight: 600;
      color: #fff8e7;
      word-break: break-word;
    }

    @keyframes logoPulse {
      0%, 100% {
        transform: scale(1);
        box-shadow:
          0 20px 40px rgba(0,0,0,0.28),
          inset 0 1px 0 rgba(255,255,255,0.04);
      }
      50% {
        transform: scale(1.03);
        box-shadow:
          0 24px 46px rgba(0,0,0,0.32),
          0 0 24px rgba(212, 175, 55, 0.10),
          inset 0 1px 0 rgba(255,255,255,0.05);
      }
    }

    @keyframes logoFloat {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-4px);
      }
    }

    @keyframes shineMove {
      0% {
        left: -120%;
      }
      55% {
        left: 130%;
      }
      100% {
        left: 130%;
      }
    }

    @keyframes glowFloat {
      0%, 100% {
        transform: translateY(0) translateX(0);
      }
      50% {
        transform: translateY(8px) translateX(6px);
      }
    }

    @media (max-width: 1120px) {
      .auth-shell {
        grid-template-columns: 1fr;
        max-width: 780px;
      }

      .left-content {
        padding: 38px 28px;
      }

      .brand-block {
        align-items: center;
        text-align: center;
      }

      .brand-chip {
        margin-left: auto;
        margin-right: auto;
      }

      .brand-copy h1 {
        font-size: 35px;
      }

      .slider-frame {
        height: 300px;
      }

      .right-panel {
        padding: 28px;
      }

      .form-card {
        max-width: 100%;
      }
    }

    @media (max-width: 640px) {
      .auth-page {
        padding: 14px;
      }

      .auth-shell {
        border-radius: 24px;
      }

      .left-content {
        padding: 28px 20px;
      }

      .logo-box {
        width: 126px;
        height: 126px;
        border-radius: 24px;
      }

      .brand-logo {
        width: 88px;
        height: 88px;
      }

      .brand-copy h1 {
        font-size: 28px;
      }

      .slider-frame {
        height: 240px;
      }

      .slide {
        padding: 18px;
      }

      .slide-content {
        padding: 14px 16px;
      }

      .slide-content h3 {
        font-size: 20px;
      }

      .right-panel {
        padding: 18px;
      }

      .form-card {
        padding: 24px 20px;
        border-radius: 22px;
      }

      .form-header h2 {
        font-size: 26px;
      }

      .field input,
      .btn-login {
        height: 52px;
      }
    }
  `]
})
export class LoginPageComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  loading = false;
  errorMessage = '';
  currentSlide = 0;

  slides = [
    {
      image: 'assets/im.jpg',
      tag: 'Gestion RH',
      title: 'Pilotez vos ressources humaines',
      text: 'Centralisez les employés, départements, contrats et processus RH dans une seule interface.'
    },
    {
      image: 'assets/im.webp',
      tag: 'Paie',
      title: 'Suivi fiable des fiches de paie',
      text: 'Consultez, générez et gérez les paies avec une présentation claire et professionnelle.'
    },
    {
      image: 'assets/images.jpg',
      tag: 'Analyse',
      title: 'Décision assistée et vision globale',
      text: 'Profitez d’une plateforme moderne pour le pilotage, les notifications et l’analyse métier.'
    }
  ];

  private slideInterval?: ReturnType<typeof setInterval>;

  form = this.fb.nonNullable.group({
    email: ['admin@payroll.com', [Validators.required, Validators.email]],
    password: ['Admin123!', Validators.required]
  });

  ngOnInit(): void {
    this.startSlider();
  }

  ngOnDestroy(): void {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  startSlider(): void {
    this.slideInterval = setInterval(() => {
      this.nextSlide(false);
    }, 4000);
  }

  resetSlider(): void {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
    this.startSlider();
  }

  nextSlide(reset: boolean = true): void {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    if (reset) this.resetSlider();
  }

  prevSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    this.resetSlider();
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
    this.resetSlider();
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.auth.login(this.form.getRawValue()).subscribe({
      next: () => {
        this.auth.me().subscribe({
          next: () => {
            this.loading = false;
            this.router.navigateByUrl('/dashboard');
          },
          error: () => {
            this.loading = false;
            this.errorMessage = 'Connexion réussie, mais profil introuvable.';
          }
        });
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.error?.message || 'Échec de connexion.';
      }
    });
  }
}