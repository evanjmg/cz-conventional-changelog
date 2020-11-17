def nodeJsName = 'NodeJS_1240'
def hash = ''
def projectName = 'cz-conventional-changelog'

pipeline {
  agent { label 'small' }
  options {
    lock("$JOB_NAME")
  }

  stages {

    stage('Checkout') {
      steps {
        checkout([
          $class: 'GitSCM',
          branches: scm.branches,
          doGenerateSubmoduleConfigurations: scm.doGenerateSubmoduleConfigurations,
          extensions: [[$class: 'CloneOption', noTags: false, shallow: false, depth: 0, reference: '']],
          userRemoteConfigs: scm.userRemoteConfigs,
        ])
        script {
          hash = sh(returnStdout: true, script: 'git describe --tag').trim()
        }
      }
    }

    stage('Installing dependencies') {
      steps {
        echo 'Installing...'
        nodejs(nodeJSInstallationName: nodeJsName) {
          configFileProvider([ configFile(fileId: 'jenkins-nexus-internal-npm', variable: 'NPM_CREDS') ]) {
             sh ''' 
              cat \$NPM_CREDS > .npmrc
              echo -e "\nemail = engineering@teckro.com" >> .npmrc
              npm ci
              '''
          }
        }
      }
    }
    
    stage('Scan') {
      steps {
        echo 'Scanning...'
        nodejs(nodeJSInstallationName: nodeJsName) {
          withSonarQubeEnv('sonarqube-developer') {
            sh "npm run sonar -Dsonar.projectKey=${projectName}"
          }
        }
      }
    }

    stage('Publish') {
      steps {
        script {
          if(env.BRANCH_NAME == 'master') {
            nodejs(nodeJSInstallationName: nodeJsName) {
              configFileProvider([ configFile(fileId: 'jenkins-nexus-internal-npm', variable: 'NPM_CREDS') ]) {
                sh 'npm run publish'
              }
            }
          }
        }
      }
    }

  }
}